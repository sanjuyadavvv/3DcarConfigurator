import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Car({
  color,
  wheelColor,
  glassColor,
  paintType,
  doorOpen,
  hoodOpen,
  trunkOpen,
  roofOpen,
  onBoundsChange,
  lightsOn = false,
  groundY = 0,
   revealWhenReady = false,
}) {
  const { scene } = useGLTF("/models/car3.glb");
  const { gl } = useThree();

  const modelRef = useRef();
  const innerRef = useRef();
  const carGroupRef = useRef();

  const [ready, setReady] = useState(false);
  const [frontLightPositions, setFrontLightPositions] = useState([]);
  const [carSize, setCarSize] = useState(null);
  const [groupY, setGroupY] = useState(groundY);

  const dragState = useRef({ dragging: false, lastX: 0 });

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e) => {
      dragState.current.dragging = true;
      dragState.current.lastX = e.clientX;
    };

    const onPointerMove = (e) => {
      if (!dragState.current.dragging || !carGroupRef.current) return;

      const deltaX = e.clientX - dragState.current.lastX;
      dragState.current.lastX = e.clientX;

      const ROTATE_SPEED = 0.005;
      carGroupRef.current.rotation.y += deltaX * ROTATE_SPEED;
    };

    const onPointerUp = () => {
      dragState.current.dragging = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [gl]);

  useEffect(() => {
    if (!scene) return;

    console.log("=== GLB MESH DUMP ===");
    scene.traverse((child) => {
      if (child.isMesh) {
        console.log({
          meshName: child.name,
          materialName: child.material?.name,
          materialType: child.material?.type,
        });
      }
    });
    console.log("=== END DUMP ===");
  }, [scene]);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!modelRef.current || !innerRef.current) return;

    modelRef.current.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    if (
      !isFinite(center.x) ||
      !isFinite(center.y) ||
      !isFinite(center.z) ||
      size.x === 0
    ) {
      console.warn("Bounding box invalid - model may not be ready yet");
      return;
    }

    innerRef.current.position.set(-center.x, -center.y, -center.z);
    setReady(true);
    setCarSize(size);
    const nextGroupY = groundY + size.y / 2;
    setGroupY(nextGroupY);

    // Report the bounds as they'll be AFTER recentering/grounding above,
    // not the raw pre-recenter world position — otherwise the camera
    // (CameraController) aims at where the model used to sit and the car
    // appears to jump the instant it becomes visible.
    if (onBoundsChange) {
      onBoundsChange({
        center: new THREE.Vector3(0, nextGroupY, 0),
        size,
      });
    }
  }, [scene, groundY, onBoundsChange]);

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      const matName = child.material.name;

      const applyOnce = (hex, opts = {}) => {
        if (!child.userData.colorCloned) {
          child.material = child.material.clone();
          child.userData.colorCloned = true;
        }

        const mat = child.material;
        mat.color.set(hex);
        if (opts.roughness !== undefined) mat.roughness = opts.roughness;
        if (opts.metalness !== undefined) mat.metalness = opts.metalness;
        if ("clearcoat" in mat && opts.clearcoat !== undefined) {
          mat.clearcoat = opts.clearcoat;
        }
        mat.needsUpdate = true;
      };

      if (matName === "XJ220MI_1256010001_002" && color) {
        applyOnce(color, {
          metalness: paintType === "metallic" ? 0.9 : 0.3,
          roughness: paintType === "matte" ? 0.9 : 0.15,
          clearcoat: paintType === "glossy" ? 1 : 0,
        });
        return;
      }

      if (matName === "XJ220MI_Rim1" && wheelColor) {
        applyOnce(wheelColor, { roughness: 0.35, metalness: 0.8 });
        return;
      }

      if (matName === "XJ220MI_Glass1" && glassColor) {
        applyOnce(glassColor, { roughness: 0.05, metalness: 0 });
      }
    });
  }, [color, wheelColor, glassColor, paintType]);

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      const matName = child.material.name;
      const isLightBody = matName === "XJ220MI_Light1";
      const isLightGlass = matName === "XJ220MI_Glass_Light1";

      if (!isLightBody && !isLightGlass) return;

      if (!child.userData.lightCloned) {
        child.material = child.material.clone();
        child.userData.lightCloned = true;
      }

      const mat = child.material;

      if (lightsOn) {
        mat.emissive = new THREE.Color(isLightGlass ? "#fff6d8" : "#ffcc66");
        mat.emissiveIntensity = isLightGlass ? 3 : 1.5;
        mat.toneMapped = false;
      } else {
        mat.emissive = new THREE.Color("#000000");
        mat.emissiveIntensity = 0;
        mat.toneMapped = true;
      }

      mat.needsUpdate = true;
    });
  }, [lightsOn]);

  useEffect(() => {
    if (!modelRef.current) return;
    // Door/hood/trunk/roof animation hooks stay here for future mesh naming.
  }, [doorOpen, hoodOpen, trunkOpen, roofOpen]);

  useEffect(() => {
    if (!ready || !modelRef.current || !carGroupRef.current) return;

    const positions = [];

    modelRef.current.traverse((child) => {
      if (!child.isMesh) return;

      if (child.name.includes("Light_F")) {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        const localPos = carGroupRef.current.worldToLocal(worldPos);
        positions.push(localPos);
      }
    });

    const unique = [];
    positions.forEach((p) => {
      const duplicate = unique.find((u) => u.distanceTo(p) < 0.05);
      if (!duplicate) unique.push(p.clone());
    });

    console.log("HEADLIGHT POSITIONS:", unique);
    setFrontLightPositions(unique);
  }, [ready]);

  return (
    <group ref={carGroupRef} position={[0, groupY, 0]}  visible={ready && revealWhenReady}>
      <group ref={innerRef}>
        <primitive ref={modelRef} object={scene} scale={100} position={[0, 1, 0]} />
      </group>

      {frontLightPositions.map((pos, i) => (
        <group key={i}>
          <HeadlightBeam
            pos={pos}
            lightsOn={lightsOn}
            groundY={carSize ? -carSize.y / 2 : pos.y - 1}
          />
        </group>
      ))}
    </group>
  );
}

function HeadlightBeam({ pos, lightsOn, groundY }) {
  const targetRef = useRef();
  const spotRef = useRef();
  const [targetReady, setTargetReady] = useState(false);

  useEffect(() => {
    if (targetRef.current) setTargetReady(true);
  }, []);

  useEffect(() => {
    if (spotRef.current && targetRef.current) {
      spotRef.current.target = targetRef.current;
      spotRef.current.target.updateMatrixWorld();
    }
  }, [targetReady]);

  const targetX = pos.x;
  const targetY = groundY;
  const targetZ = pos.z + 3;

  return (
    <>
      <object3D
        ref={(el) => {
          targetRef.current = el;
          if (el && !targetReady) setTargetReady(true);
        }}
        position={[targetX, targetY, targetZ]}
      />

      {targetReady && (
        <spotLight
          ref={spotRef}
          position={[pos.x, pos.y, pos.z]}
          target={targetRef.current}
          angle={0.35}
          penumbra={0.6}
          distance={12}
          decay={2}
          intensity={lightsOn ? 300 : 0}
          color="#fff8e8"
          castShadow
        />
      )}
    </>
  );
}

export default Car;
