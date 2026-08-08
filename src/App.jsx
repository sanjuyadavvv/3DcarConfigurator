import { useState,useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Car from "./components/Car";
import CameraController from "./components/CameraController";
import { Camera } from "three";
function App() {


  const controlsRef=useRef();
  const [carColor, setCarColor] = useState("#ff0000");
  const [wheelColor, setWheelColor] = useState("#c0c0c0");
  const [glassColor, setGlassColor] = useState("#87ceeb");

  const [view, setView] = useState("default");
  const basePrice = 50000000;




  const bodyPrices = {
    "#ff0000": 0,
    "#000000": 500000,
    "#ffffff": 300000,
    "#0066ff": 700000,
    "#808080": 400000,
    "#ffd700": 1000000,
  };

  const wheelPrices = {
    "#c0c0c0": 0,
    "#000000": 500000,
    "#ffd700": 1000000,
  };

  const glassPrices = {
    "#87ceeb": 0,
    "#222222": 200000,
    "#000000": 300000,
  };

  const totalPrice =
    basePrice +
    bodyPrices[carColor] +
    wheelPrices[wheelColor] +
    glassPrices[glassColor];

  const colors = [
    "#ff0000",
    "#000000",
    "#ffffff",
    "#0066ff",
    "#808080",
    "#ffd700",
  ];

  const wheelColors = ["#c0c0c0", "#000000", "#ffd700"];

  const glassColors = ["#87ceeb", "#222222", "#000000"];

  return (
    <div className="app">
      {/* CONFIGURATION PANEL */}

      <div className="controls">
        <h2>Lamborghini Aventador</h2>

        {/* BODY */}

        <h3>Body Color</h3>

        <div className="color-options">
          {colors.map((color) => (
            <button
              key={color}
              className={`color-button ${carColor === color ? "selected" : ""}`}
              style={{
                backgroundColor: color,
              }}
              onClick={() => setCarColor(color)}
            />
          ))}
        </div>

        {/* WHEELS */}

        <h3 className="section-title">Wheel Finish</h3>

        <div className="color-options">
          {wheelColors.map((color) => (
            <button
              key={color}
              className={`color-button ${
                wheelColor === color ? "selected" : ""
              }`}
              style={{
                backgroundColor: color,
              }}
              onClick={() => setWheelColor(color)}
            />
          ))}
        </div>

        {/* GLASS */}

        <h3 className="section-title">Glass Tint</h3>

        <div className="color-options">
          {glassColors.map((color) => (
            <button
              key={color}
              className={`color-button ${
                glassColor === color ? "selected" : ""
              }`}
              style={{
                backgroundColor: color,
              }}
              onClick={() => setGlassColor(color)}
            />
          ))}
        </div>

        <h3 className="section-title">Camera View</h3>

        <div className="view-options">
          <button onClick={() => setView("front")}>Front</button>

          <button onClick={() => setView("side")}>Side</button>

          <button onClick={() => setView("rear")}>Rear</button>

          <button onClick={() => setView("top")}>Top</button>

          <button onClick={() => setView("default")}>Reset</button>
        </div>

        {/* PRICE */}

        <div className="price-section">
          <p>Base Price: ₹{basePrice.toLocaleString("en-IN")}</p>

          <p>Body: +₹{bodyPrices[carColor].toLocaleString("en-IN")}</p>

          <p>Wheels: +₹{wheelPrices[wheelColor].toLocaleString("en-IN")}</p>

          <p>Glass: +₹{glassPrices[glassColor].toLocaleString("en-IN")}</p>

          <hr />

          <h2>Total: ₹{totalPrice.toLocaleString("en-IN")}</h2>
        </div>
      </div>

      {/* 3D SCENE */}

      <Canvas
        camera={{
          position: [5, 2, 5],
          fov: 45,
        }}
      >
        <ambientLight intensity={0.5} />

        <directionalLight position={[5, 5, 5]} intensity={2} />

        <Environment preset="city" />

        <Car color={carColor} wheelColor={wheelColor} glassColor={glassColor} />
        <CameraController view={view} controlsRef={controlsRef} />
        <OrbitControls ref={controlsRef} enableDamping />
      </Canvas>
    </div>
  );
}

export default App;
