import { useRef, useMemo } from "react";
import * as THREE from "three";

function BlindsGobo({ y = 6 }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "white";
    for (let x = 0; x < 128; x += 18) ctx.fillRect(x, 0, 8, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <mesh position={[0, y, -1]} rotation={[0, Math.PI / 5, 0]} castShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial
        alphaMap={texture}
        transparent
        alphaTest={0.4}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function LightRig() {
  const lightRef = useRef();

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[3, 8, 4]}
        intensity={3.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
      />
      <BlindsGobo y={6} />
      <spotLight
        position={[-6, 3, -2]}
        angle={0.5}
        penumbra={1}
        intensity={80}
        color="#bcd4ff"
      />
    </>
  );
}

export default LightRig;