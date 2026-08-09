import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";

import Car from "./components/Car";
import CameraController from "./components/CameraController";
import ConfigPanel from "./components/ConfigPanel";

function App() {
  const controlsRef = useRef();
  const [bounds, setBounds] = useState(null);

  const [configuration, setConfiguration] = useState({
    bodyColor: "#ff0000",
    wheelColor: "#c0c0c0",
    glassColor: "#87ceeb",
    view: "default",
    paintType: "glossy",
    doorOpen: false,
    hoodOpen: false,
    trunkOpen: false,
    roofOpen: false,
  });

  return (
    <div className="app">
      <ConfigPanel
        configuration={configuration}
        setConfiguration={setConfiguration}
      />

      <Canvas camera={{ fov: 45, near: 0.01, far: 1000 }}>
        <ambientLight intensity={0.5} />

        <directionalLight position={[5, 5, 5]} intensity={2} />

        <Environment preset="city" />

        <Suspense fallback={null}>
          <Car
            color={configuration.bodyColor}
            wheelColor={configuration.wheelColor}
            glassColor={configuration.glassColor}
            paintType={configuration.paintType}
            doorOpen={configuration.doorOpen}
            hoodOpen={configuration.hoodOpen}
            trunkOpen={configuration.trunkOpen}
            roofOpen={configuration.roofOpen}
            onBoundsChange={setBounds}
          />
        </Suspense>

        {/* CameraController derives every view from the model's actual
            measured bounds (see Car.jsx), so a new/different GLB just
            works without retuning any positions by hand. */}
        <CameraController
          view={configuration.view}
          bounds={bounds}
          controlsRef={controlsRef}
        />

        <OrbitControls ref={controlsRef} enableDamping makeDefault />
      </Canvas>

      {/* drei's built-in loading indicator, shows while the .glb downloads */}
      <Loader />
    </div>
  );
}

export default App;