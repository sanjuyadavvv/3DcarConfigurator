import ColorSelector from "./ColorSelector";
import PriceSummary from "./PriceSummary";

function ConfigPanel({
  configuration,
  setConfiguration,
}) {

  const bodyColors = [
    "#ff0000",
    "#000000",
    "#ffffff",
    "#0066ff",
    "#808080",
    "#ffd700",
    "#ff69b4",
  ];

  const wheelColors = [
    "#c0c0c0",
    "#000000",
    "#ffd700",
  ];

  const glassColors = [
    "#87ceeb",
    "#222222",
    "#000000",
  ];

  const paintTypes=  [
     {
    name: "Glossy",
    value: "glossy",
  },
  {
    name: "Metallic",
    value: "metallic",
  },
  {
    name: "Matte",
    value: "matte",
  },
  ]
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

  const basePrice = 50000000;

  return (
    <div className="controls">

      <h2>
        Lamborghini Aventador
      </h2>

      <ColorSelector
        title="Body Color"
        colors={bodyColors}
        selectedColor={configuration.bodyColor}
        onSelect={(color) =>
          setConfiguration((prev) => ({
            ...prev,
            bodyColor: color,
          }))
        }
      />

      <ColorSelector
        title="Wheel Color"
        colors={wheelColors}
        selectedColor={configuration.wheelColor}
        onSelect={(color) =>
          setConfiguration((prev) => ({
            ...prev,
            wheelColor: color,
          }))
        }
      />

      <ColorSelector
        title="Glass Tint"
        colors={glassColors}
        selectedColor={configuration.glassColor}
        onSelect={(color) =>
          setConfiguration((prev) => ({
            ...prev,
            glassColor: color,
          }))
        }
      />

      <h3 className="section-title">
        Camera View
      </h3>

      <div className="view-options">

<button
  onClick={() =>
    setConfiguration((prev) => ({
      ...prev,
      doorOpen: !prev.doorOpen,
    }))
  }
>
  {configuration.doorOpen
    ? "Close Door"
    : "Open Door"}
</button>

<button
  onClick={() =>
    setConfiguration((prev) => ({
      ...prev,
      hoodOpen: !prev.hoodOpen,
    }))
  }
>
  {configuration.hoodOpen
    ? "Close Hood"
    : "Open Hood"}
</button>

<button
  onClick={() =>
    setConfiguration((prev) => ({
      ...prev,
      trunkOpen: !prev.trunkOpen,
    }))
  }
>
  {configuration.trunkOpen
    ? "Close Trunk"
    : "Open Trunk"}
</button>

<button
  onClick={() =>
    setConfiguration((prev) => ({
      ...prev,
      roofOpen: !prev.roofOpen,
    }))
  }
>
  {configuration.roofOpen
    ? "Close Roof"
    : "Open Roof"}
</button>
</div>

<h3 className="section-title">
       Paint Finish
</h3>
<div className='Paint-options'>
    {paintTypes.map((paint) => (
      <button
        key={paint.value}
        onClick={() => setConfiguration(prev => ({
          ...prev,
          paintType: paint.value
        }))}>
        {paint.name}
      </button>
    ))}

</div>
      <PriceSummary
        basePrice={basePrice}
        bodyPrice={
          bodyPrices[configuration.bodyColor] || 0
        }
        wheelPrice={
          wheelPrices[configuration.wheelColor] || 0
        }
        glassPrice={
          glassPrices[configuration.glassColor] || 0
        }
      />

    </div>
  );
}

export default ConfigPanel;