import { useGLTF } from "@react-three/drei";
import {useEffect,useRef} from "react";
import * as THREE from "three";

function Car({ color, wheelColor,glassColor }) {
  const { scene } = useGLTF("/models/car.glb");
  const groupRef = useRef();

  const body = scene.getObjectByName(
    "Lamborghini_Aventador_Body"
  );

  const wheelNames = [
    "Lamborghini_Aventador_Wheel_FL",
    "Lamborghini_Aventador_Wheel_FR",
    "Lamborghini_Aventador_Wheel_RL",
    "Lamborghini_Aventador_Wheel_RR",
  ];


  const glass = scene.getObjectByName(
    "Lamborghini_Aventador_Glass"
  );
  // BODY
  if (body && body.isMesh) {
    if (!body.userData.materialCloned) {
      body.material = body.material.clone();

      // Remove original texture
      body.material.map = null;

      body.userData.materialCloned = true;
    }

    body.material.color.set(color);
    body.material.needsUpdate = true;
  }

  // WHEELS
  wheelNames.forEach((name) => {
    const wheel = scene.getObjectByName(name);

    if (wheel && wheel.isMesh) {
      if (!wheel.userData.materialCloned) {
        wheel.material = wheel.material.clone();

        // Remove original texture
        wheel.material.map = null;

        wheel.userData.materialCloned = true;
      }

      wheel.material.color.set(wheelColor);
      wheel.material.needsUpdate = true;
    }
  });



 // GLASS

if (glass) {
  if (!glass.userData.materialCloned) {
    glass.material = glass.material.clone();
    glass.material.map = null; // Remove original texture
    glass.userData.materialCloned = true;
  }

  glass.material.color.set(glassColor);

  glass.material.transparent = true;
  glass.material.opacity = 0.45;

  glass.material.roughness = 0.1;
  glass.material.metalness = 0;

  glass.material.needsUpdate = true;
}


  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    console.log("Model size:", size);   // how big the car actually is
    console.log("Model center:", center); // where its middle actually is
  }, [scene]);


  return (

    <group  ref={groupRef} scale={0.01}>
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
    </group>
  );
}

export default Car;