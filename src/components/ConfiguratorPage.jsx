import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Car from "./Car";
import CameraController from "./CameraController";
import LoadingScreen from "./LoadingScreen";
import { useConfig } from "./context/ConfigContext";
import ConfigPanel from "./ConfigPanel";
import Ground from "./Ground";

// The floor is a fixed plane at this world Y - it never moves. Car.jsx
// measures the loaded model and positions itself so its wheels land
// exactly here, instead of Ground chasing the car's position.
const GROUND_Y = 0;

function ConfiguratorPage() {
  const { configuration, setConfiguration } = useConfig();
  const controlsRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [activeSection, setActiveSection] = useState("exterior");
  const [cameraReady, setCameraReady] = useState(false);

  const handleCameraReady = useCallback(() => setCameraReady(true), []);

  return (
    <div className="configurator-page">
      <div className="configurator-canvas">
        <Canvas
          shadows
          camera={{ fov: 40, near: 0.01, far: 1000, position: [0, 1.0, 4.2] }}
          gl={{
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.9,
          }}
        >
          <color attach="background" args={["#050505"]} />
          <fog attach="fog" args={["#050505", 8, 22]} />
          <ambientLight intensity={0.25} />
          <Environment preset="city" environmentIntensity={0.35} background={false} />

          <Suspense fallback={<LoadingScreen />}>
            <Car
              color={configuration.bodyColor}
              wheelColor={configuration.wheelColor}
              glassColor={configuration.glassColor}
              paintType={configuration.paintType}
              lightsOn={configuration.lightsOn}
              groundY={GROUND_Y}
              onBoundsChange={setBounds}
              revealWhenReady={cameraReady}
            />
          </Suspense>

          <CameraController bounds={bounds} controlsRef={controlsRef} onReady={handleCameraReady} />

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableRotate={false}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={6}
          />

          <Ground y={GROUND_Y} />
          <ContactShadows
            position={[0, GROUND_Y + 0.01, 0]}
            opacity={0.75}
            scale={12}
            blur={1.8}
            far={3}
            resolution={1024}
          />
        </Canvas>
      </div>

      <div className="configurator-bottom-bar">
        <ConfigPanel
          section={activeSection}
          onSectionChange={setActiveSection}
          configuration={configuration}
          setConfiguration={setConfiguration}
        />
      </div>
    </div>
  );
}

export default ConfiguratorPage;
