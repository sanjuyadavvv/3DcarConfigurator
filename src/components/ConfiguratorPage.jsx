import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useParams } from "react-router-dom";
import Car from "./Car";
import { useConfig } from "./context/ConfigContext";
import ConfigPanel from "./ConfigPanel";

function ConfiguratorPage() {
  const { section } = useParams();
  const { configuration, setConfiguration } = useConfig(); // only this — remove the other useConfig() call
  const controlsRef = useRef();

  return (
    <div className="configurator">
      <div className="configurator-canvas">
        <Canvas camera={{ fov: 45, near: 0.01, far: 1000, position: [0, 1.2, 4] }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <Car
              color={configuration.bodyColor}
              wheelColor={configuration.wheelColor}
              glassColor={configuration.glassColor}
              paintType={configuration.paintType}
              enableEntranceAnimation={false}
              lightsOn={configuration.lightsOn}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={6}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2.1}
            minAzimuthAngle={-Math.PI / 2}
            maxAzimuthAngle={Math.PI / 2}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>
      </div>

      <div className="configurator-bottom-bar">
        <ConfigPanel
          section={section}
          configuration={configuration}
          setConfiguration={setConfiguration}
        />
      </div>
    </div>
  );
}

export default ConfiguratorPage;