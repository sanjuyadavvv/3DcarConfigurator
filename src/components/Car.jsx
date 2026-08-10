import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

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
  enableEntranceAnimation = false,
  lightsOn = false,
}) {
  const { scene } = useGLTF("/models/car3.glb");
  const { viewport } = useThree();

  const modelRef = useRef();
  const innerRef = useRef();
  const carGroupRef = useRef();

  const frontLightPosRef = useRef([]);
  const spotLightRefs = useRef([]);
  const targetRefs = useRef([]);
  const headlightsRef = useRef();
  const [ready, setReady] = useState(false);

  // ---- ONE-TIME DEBUG: log every mesh + material name in the GLB ----
  // Open your browser console, reload, and copy what this prints —
  // send it back to me so I can wire up real color targeting.
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

  // Recenter the model inside innerRef so carGroupRef.position === car's world center
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
      console.warn("Bounding box invalid — model may not be ready yet");
      return;
    }

    innerRef.current.position.set(-center.x, -center.y, -center.z);
    setReady(true);

    if (onBoundsChange) onBoundsChange({ center, size });
  }, [scene]);

  // Entrance animation — unchanged from yours
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    if (!ready || !carGroupRef.current || !modelRef.current) return;
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;

    const car = carGroupRef.current;

    // Configurator page: just place it centered, skip the slide-in entirely
    if (!enableEntranceAnimation) {
      car.position.set(0, 0, 0);
      car.rotation.y = Math.PI / 6; // starting angle, tweak to taste
      car.scale.set(1, 1, 1);
      return;
    }

    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = box.getSize(new THREE.Vector3());
    const halfWidth = size.x / 2;
    const halfHeight = size.y / 2;

    const screenHalfWidth = viewport.width / 2;
    const screenHalfHeight = viewport.height / 2;

    const bottomMargin = viewport.height * 0.06;
    const groundY = -screenHalfHeight + bottomMargin + halfHeight;

    const startX = screenHalfWidth + halfWidth + 1;
    const edgeGap = 1.5;
    const endX = -screenHalfWidth + halfWidth + edgeGap;

    car.position.set(startX, groundY, 0);
    car.rotation.y = -Math.PI / 2;
    car.scale.set(1, 1, 1);

    const timeline = gsap.timeline();
    timeline.to(car.position, {
      x: endX,
      duration: 4,
      delay: 0.5,
      ease: "power2.inOut",
    });

    return () => timeline.kill();
  }, [ready, enableEntranceAnimation]);

  // ---- PLACEHOLDER color/paint application ----
  // This runs but does nothing useful yet because I don't know your
  // real mesh names — it's here so the wiring compiles and you can
  // see it firing in the console. I'll replace the `includes()` checks
  // once you send me the mesh dump above.
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
        if ("clearcoat" in mat && opts.clearcoat !== undefined)
          mat.clearcoat = opts.clearcoat;
        mat.needsUpdate = true;
      };

      // BODY PAINT — the real exterior paint material, shared across
      // doors, hood, fenders, mirrors, front light housing
      if (matName === "XJ220MI_1256010001_002" && color) {
        applyOnce(color, {
          metalness: paintType === "metallic" ? 0.9 : 0.3,
          roughness: paintType === "matte" ? 0.9 : 0.15,
          clearcoat: paintType === "glossy" ? 1 : 0,
        });
        return;
      }

      // WHEEL RIM — the actual chrome rim, NOT the caliper (phong1)
      // and NOT the tire (Thick_Tire1)
      if (matName === "XJ220MI_Rim1" && wheelColor) {
        applyOnce(wheelColor, { roughness: 0.35, metalness: 0.8 });
        return;
      }

      // GLASS — main windows only, not headlight lenses (Glass_Light1)
      if (matName === "XJ220MI_Glass1" && glassColor) {
        applyOnce(glassColor, { roughness: 0.05, metalness: 0 });
        return;
      }
    });
  }, [color, wheelColor, glassColor, paintType]);

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      const matName = child.material.name;
      const isLightBody = matName === "XJ220MI_Light1"; // housing/lens plastic
      const isLightGlass = matName === "XJ220MI_Glass_Light1"; // clear cover over the bulb

      if (!isLightBody && !isLightGlass) return;

      if (!child.userData.lightCloned) {
        child.material = child.material.clone();
        child.userData.lightCloned = true;
      }

      const mat = child.material;

      if (lightsOn) {
        mat.emissive = new THREE.Color(isLightGlass ? "#fff6d8" : "#ffcc66");
        mat.emissiveIntensity = isLightGlass ? 3 : 1.5;
      } else {
        mat.emissive = new THREE.Color("#000000");
        mat.emissiveIntensity = 0;
      }

      mat.needsUpdate = true;
    });
  }, [lightsOn]);

  // ---- PLACEHOLDER door/hood/trunk/roof toggles ----
  // Same story — needs real mesh/hierarchy names to actually rotate
  // hinge groups. Send the dump and I'll fill this in properly.
  useEffect(() => {
    if (!modelRef.current) return;
    // e.g. once we know the name:
    // const door = modelRef.current.getObjectByName("Door_L");
    // if (door) gsap.to(door.rotation, { y: doorOpen ? -1.2 : 0, duration: 0.6 });
  }, [doorOpen, hoodOpen, trunkOpen, roofOpen]);

  // Locate front headlight world positions once the model is ready
  useEffect(() => {
    if (!ready || !modelRef.current) return;

    const positions = [];

    modelRef.current.traverse((child) => {
      if (!child.isMesh) return;

      if (child.name.includes("Light_F")) {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);

        // Convert world position into carGroup local space
        const localPos = carGroupRef.current.worldToLocal(worldPos);

        positions.push(localPos);
      }
    });

    const unique = [];

    positions.forEach((p) => {
      const duplicate = unique.find((u) => u.distanceTo(p) < 0.05);

      if (!duplicate) {
        unique.push(p.clone());
      }
    });

    frontLightPosRef.current = unique;

    console.log("HEADLIGHT POSITIONS:", unique);
  }, [ready]);

  // Toggle spotlight intensity with lightsOn (positions set via JSX below)
  useEffect(() => {
    spotLightRefs.current.forEach((light) => {
      if (!light) return;
      light.intensity = lightsOn ? 500 : 0;
    });
  }, [lightsOn, frontLightPosRef.current.length]);

  return (
    <group ref={carGroupRef} position={[0, 2, 0]}>
      <group ref={innerRef}>
        <primitive
          ref={modelRef}
          object={scene}
          scale={100}
          position={[0, 1, 0]}
        />
      </group>

      {frontLightPosRef.current.map((pos, i) => (
        <group key={i}>
          <object3D
            ref={(el) => {
              targetRefs.current[i] = el;
            }}
            position={[pos.x, pos.y - 0.1, pos.z + 8]}
          />

          <spotLight
            ref={(el) => {
              spotLightRefs.current[i] = el;
            }}
            position={[pos.x, pos.y, pos.z]}
            target={targetRefs.current[i]}
            angle={0.3}
            penumbra={0.4}
            distance={20}
            decay={2}
            intensity={lightsOn ? 500 : 0}
            color="#fff8e8"
            castShadow
          />
        </group>
      ))}
    </group>
  );
}

export default Car;
