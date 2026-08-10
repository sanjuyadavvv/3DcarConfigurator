import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import Car from "./Car";

function LandingPage() {
  const navigate = useNavigate();
  const [bounds, setBounds] = useState(null);

  return (
    <div className="app">
      <section className="hero">
        <div className="hero-canvas">
          <Canvas camera={{ fov: 45, near: 0.01, far: 1000 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <Car
                // color="#ff0000"
                // wheelColor="#c0c0c0"
                // glassColor="#87ceeb"
                paintType="glossy"
                onBoundsChange={setBounds}
                enableEntranceAnimation={true}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">JAGUAR</p>
          <h1>XJ220</h1>
          <p className="hero-subtitle">THE ART OF PERFORMANCE</p>

          <button
            className="explore-button"
            onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
          >
            EXPLORE
            <span>↓</span>
          </button>
        </div>
      </section>

      <section id="experience" className="experience">
        <div className="experience-content">
          <p className="section-eyebrow">EXPERIENCE</p>
          <h2>BUILT TO<br />BE UNFORGETTABLE.</h2>
          <p>Discover the design, performance and engineering behind the XJ220.</p>

          <button className="explore-button" onClick={() => navigate("/configure/exterior")}>
            CONFIGURE YOUR XJ220
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;