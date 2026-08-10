import { useState } from "react";
import SpectrumPicker from "./SpectrumPicker";

function ConfigPanel({ section, configuration, setConfiguration }) {
  // null = bar collapsed, no spectrum showing
  const [activeColorTarget, setActiveColorTarget] = useState(null);
  const [sliderPositions, setSliderPositions] = useState({ body: 0.14, wheels: 0 });
  const [showMore, setShowMore] = useState(false);

  const targetKeyMap = { body: "bodyColor", wheels: "wheelColor" };

  const handleSpectrumChange = (pos, hex) => {
    setSliderPositions((prev) => ({ ...prev, [activeColorTarget]: pos }));
    setConfiguration((prev) => ({ ...prev, [targetKeyMap[activeColorTarget]]: hex }));
  };

  const toggleTarget = (key) => {
    setShowMore(false);
    setActiveColorTarget((prev) => (prev === key ? null : key));
  };

  const paintTypes = [
    { name: "Glossy", value: "glossy" },
    { name: "Metallic", value: "metallic" },
    { name: "Matte", value: "matte" },
  ];

  if (section === "interior") {
    return (
      <div className="bottom-bar-wrap">
        <div className="bottom-bar">
          <div className="bar-label">INTERIOR</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-bar-wrap">
      {/* Spectrum popup — only rendered when a color target is active */}
      {activeColorTarget && (
        <div className="spectrum-popup">
          <SpectrumPicker
            position={sliderPositions[activeColorTarget]}
            onChange={handleSpectrumChange}
          />
        </div>
      )}

      {/* Paint finish popup — not in the reference screenshot, added so
          Glossy/Metallic/Matte has somewhere to live without cluttering
          the main bar. Remove this block if you don't want it. */}
      {showMore && (
        <div className="more-popup">
          {paintTypes.map((p) => (
            <button
              key={p.value}
              className={configuration.paintType === p.value ? "active" : ""}
              onClick={() => setConfiguration((prev) => ({ ...prev, paintType: p.value }))}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="bottom-bar">
        <div className="bar-label">JAGUAR XJ220</div>

        <button
          className={`bar-icon ${activeColorTarget === "body" ? "active" : ""}`}
          style={activeColorTarget === "body" ? { background: configuration.bodyColor } : {}}
          onClick={() => toggleTarget("body")}
          title="Body Color"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z" />
          </svg>
        </button>

        <button
          className={`bar-icon ${activeColorTarget === "wheels" ? "active" : ""}`}
          style={activeColorTarget === "wheels" ? { background: configuration.wheelColor } : {}}
          onClick={() => toggleTarget("wheels")}
          title="Wheel Color"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </button>

        <button
          className={`bar-icon ${showMore ? "active" : ""}`}
          onClick={() => {
            setActiveColorTarget(null);
            setShowMore((prev) => !prev);
          }}
          title="Paint Finish"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
            <path fill="currentColor" d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6z" />
          </svg>
        </button>

        <button
  className={`bar-icon ${configuration.lightsOn ? "active" : ""}`}
  onClick={() =>
    setConfiguration((prev) => ({ ...prev, lightsOn: !prev.lightsOn }))
  }
  title="Headlights"
>
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path
      fill="currentColor"
      d="M9 18h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1zm3-16a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2z"
    />
  </svg>
</button>
      </div>
    </div>
  );
}

export default ConfigPanel;