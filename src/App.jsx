import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";

import Car from "./components/Car";
import CameraController from "./components/CameraController";
import ConfigPanel from "./components/ConfigPanel";
import gsap from "gsap";
import "./App.css";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const controlsRef = useRef();

  const heroContentRef = useRef();
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
      {/* ================= HERO ================= */}

      <section className="hero">
        <div className="hero-content" ref={heroContentRef}>
          <p className="hero-eyebrow">AUTOMOBILI LAMBORGHINI</p>

          <h1>AVENTADOR</h1>

          <p className="hero-subtitle">THE ART OF PERFORMANCE</p>

          <button
            className="explore-button"
            onClick={() => {
              document.getElementById("experience")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            EXPLORE
            <span>↓</span>
          </button>
        </div>

        {/* 3D CAR */}

        <div className="hero-canvas">
          <Canvas
            camera={{
              fov: 45,
              near: 0.01,
              far: 1000,
            }}
          >
            <ambientLight intensity={0.4} />

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
            {/* <LoadingScreen/> */}
            <CameraController
              view={configuration.view}
              bounds={bounds}
              controlsRef={controlsRef}
            />

            {/* <OrbitControls
              ref={controlsRef}
              enableDamping
              makeDefault
            /> */}
          </Canvas>
        </div>
      </section>

      {/* ================= EXPERIENCE ================= */}

      <section id="experience" className="experience">
        <div className="experience-content">
          <p className="section-eyebrow">EXPERIENCE</p>

          <h2>
            BUILT TO
            <br />
            BE UNFORGETTABLE.
          </h2>

          <p>
            Discover the design, performance and engineering behind the
            Aventador.
          </p>
        </div>
      </section>

      {/* ================= CONFIGURATOR ================= */}

      <section className="configurator">
        <div className="configurator-content">
          <p className="section-eyebrow">YOUR AVENTADOR</p>

          <h2>MAKE IT YOURS.</h2>

          <p>Customize every detail of your vehicle.</p>
        </div>
      </section>

      <LoadingScreen />
    </div>
  );
}

export default App;
