import { useGLTF, Center } from "@react-three/drei";
import { useEffect, useRef } from "react";
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
}) {
  const { scene } = useGLTF("/models/car3.glb");
  const groupRef = useRef();

  // =========================================================
  // BOUNDS (measured from the actual model, not hardcoded)
  // =========================================================
  // Runs once per loaded model, after <Center> has already grounded/centered
  // it, so the camera setup works for any GLB without manual retuning.
  useEffect(() => {
    if (!groupRef.current || !onBoundsChange) return;
    groupRef.current.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    onBoundsChange({ center: center.toArray(), size: size.toArray() });
  }, [scene, onBoundsChange]);

  // =========================================================
  // MATERIALS
  // =========================================================
  useEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh) return;

      const name = object.name.toLowerCase();

      // GLASS
      if (name.includes("glass1") || name.includes("glass_")) {
        if (!object.userData.glassCloned) {
          object.material = object.material.clone();
          object.userData.glassCloned = true;
        }
        const mat = object.material;
        mat.color.set(glassColor);
        mat.transparent = true;
        mat.opacity = 0.45;
        mat.roughness = 0.1;
        mat.metalness = 0;
        mat.needsUpdate = true;
        return;
      }

      // WHEELS
      if (
        name.includes("wheel") ||
        name.includes("tire") ||
        name.includes("tyre")
      ) {
        if (!object.userData.wheelCloned) {
          object.material = object.material.clone();
          object.userData.wheelCloned = true;
        }
        const mat = object.material;
        mat.color.set(wheelColor);
        mat.roughness = 0.45;
        mat.metalness = 0.3;
        mat.needsUpdate = true;
        return;
      }

      // DON'T MODIFY BRAKES
      // KNOWN ISSUE: some real body-shell meshes contain "brake" in their
      // auto-generated material-slot name and get wrongly excluded here.
      // Needs a confirmed mesh-name whitelist — see debug tagNext() pass.
      if (name.includes("brake") || name.includes("disc")) return;

      // DON'T MODIFY INTERIOR
      if (
        name.includes("cabin") ||
        name.includes("leather") ||
        name.includes("carpet") ||
        name.includes("dashboard") ||
        name.includes("belt")
      ) return;

      // DON'T MODIFY LIGHTS
      if (name.includes("light1") || name.includes("glass_light")) return;

      // DON'T MODIFY EXHAUST
      if (name.includes("exhaust")) return;

      // BODY
      const isBody =
        name.includes("xj220sm_body_") ||
        name.includes("xj220sm_fender_") ||
        name.includes("xj220sm_bumper_") ||
        name.includes("xj220sm_roof_") ||
        name.includes("xj220sk_hood_") ||
        name.includes("xj220sk_spoiler_") ||
        name.includes("xj220sk_door_");

      if (!isBody) return;

      if (!object.userData.bodyCloned) {
        const oldMaterial = object.material;
        object.material = new THREE.MeshPhysicalMaterial({
          color: oldMaterial.color,
          map: null,
        });
        object.userData.bodyCloned = true;
      }

      const mat = object.material;
      mat.map = null;
      mat.color.set(color);

      if (paintType === "glossy") {
        mat.metalness = 0;
        mat.roughness = 0.05;
        mat.clearcoat = 1;
        mat.clearcoatRoughness = 0.03;
        mat.envMapIntensity = 1.5;
      }

      if (paintType === "metallic") {
        mat.metalness = 0.9;
        mat.roughness = 0.25;
        mat.clearcoat = 1;
        mat.clearcoatRoughness = 0.05;
        mat.envMapIntensity = 2;
      }

      if (paintType === "matte") {
        mat.metalness = 0;
        mat.roughness = 0.9;
        mat.clearcoat = 0;
        mat.envMapIntensity = 0.2;
      }

      mat.needsUpdate = true;
    });
  }, [scene, color, wheelColor, glassColor, paintType]);

  // =========================================================
  // OBJECT LOOKUP HELPERS
  // =========================================================
  const findObject = (keyword) => {
    let found = null;
    scene.traverse((object) => {
      if (found) return;
      if (object.name.toLowerCase().includes(keyword.toLowerCase())) {
        found = object;
      }
    });
    return found;
  };

  // Multiple nodes exist for hood/trunk — animate all of them together
  const findAllObjects = (keyword) => {
    const found = [];
    scene.traverse((object) => {
      if (object.name.toLowerCase().includes(keyword.toLowerCase())) {
        found.push(object);
      }
    });
    return found;
  };

  // =========================================================
  // DOOR / HOOD / TRUNK / ROOF ANIMATION
  // =========================================================
  useEffect(() => {
    const door = findObject("XJ220SK_Door_FL");
    if (door) door.rotation.y = doorOpen ? THREE.MathUtils.degToRad(30) : 0;
  }, [scene, doorOpen]);

  useEffect(() => {
    findAllObjects("XJ220SK_Hood").forEach((hood) => {
      hood.rotation.x = hoodOpen ? THREE.MathUtils.degToRad(-30) : 0;
    });
  }, [scene, hoodOpen]);

  useEffect(() => {
    findAllObjects("XJ220SK_Trunk").forEach((trunk) => {
      trunk.rotation.x = trunkOpen ? THREE.MathUtils.degToRad(30) : 0;
    });
  }, [scene, trunkOpen]);

  useEffect(() => {
    const roof = findObject("XJ220SM_Roof");
    if (roof) roof.rotation.x = roofOpen ? THREE.MathUtils.degToRad(30) : 0;
  }, [scene, roofOpen]);

  // =========================================================
  // RENDER
  // =========================================================
  // <Center bottom> auto-grounds (bottom of model sits at y=0) and
  // auto-centers X/Z — no manual Box3 math, no position guesswork.
  // Works correctly no matter what scale value you use.
  return (
    <group ref={groupRef}>
      <Center bottom>
        <primitive object={scene} scale={50} />
      </Center>
    </group>
  );
}

export default Car;