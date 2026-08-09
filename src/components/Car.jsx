import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

function Car({ /* ...same props... */ onBoundsChange }) {
  const { scene } = useGLTF("/models/car3.glb");
  const { viewport } = useThree();

  const modelRef = useRef();
  const innerRef = useRef();   // holds the model, recentered
  const carGroupRef = useRef(); // this is what we animate

  const [ready, setReady] = useState(false);

  // ...findObjects, debug traverse, materials effect — unchanged...

  // Recenter the model inside innerRef so carGroupRef.position === car's world center
  useEffect(() => {
    if (!modelRef.current || !innerRef.current) return;

    modelRef.current.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log("Car box size:", size, "center:", center);

    if (
      !isFinite(center.x) || !isFinite(center.y) || !isFinite(center.z) ||
      size.x === 0
    ) {
      console.warn("Bounding box invalid — model may not be ready yet");
      return;
    }

    innerRef.current.position.set(-center.x, -center.y, -center.z);
    setReady(true);
  }, [scene]);

  // Entrance animation — now pure, no frontOffset guessing
const hasEnteredRef = useRef(false); // add alongside your other refs

useEffect(() => {
  if (!ready || !carGroupRef.current || !modelRef.current) return;
  if (hasEnteredRef.current) return; // guard: never replay the entrance
  hasEnteredRef.current = true;

  const box = new THREE.Box3().setFromObject(modelRef.current);
  const size = box.getSize(new THREE.Vector3());
  const halfWidth = size.x / 2;
  const halfHeight = size.y / 2;

  const screenHalfWidth = viewport.width / 2;
  const screenHalfHeight = viewport.height / 2;

  const bottomMargin = viewport.height * 0.06;
  const groundY = -screenHalfHeight + bottomMargin + halfHeight;

  const startX = screenHalfWidth + halfWidth + 1;
  const edgeGap = 1;
  const endX = -screenHalfWidth + halfWidth + edgeGap;

  const car = carGroupRef.current;
  car.position.set(startX, groundY, 0);
  car.rotation.y = -Math.PI / 2;
  car.scale.set(1, 1, 1); // no scale trick — see note below

  const timeline = gsap.timeline();
  timeline.to(car.position, {
    x: endX,
    duration: 4,
    delay: 0.5,
    ease: "power2.inOut",
  });

  return () => timeline.kill();
}, [ready]); // note: viewport is no longer a dependency


  return (
    <group ref={carGroupRef} position={[0, 0, 0]}>
      <group ref={innerRef}>
        <primitive ref={modelRef} object={scene} scale={100} position={[0, -0.12, 0]} />
      </group>
    </group>
  );
}

export default Car;