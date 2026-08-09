function ColorSelector({
  title,
  colors,
  selectedColor,
  onSelect,
}) {
  return (
    <div className="color-section">

      <h3>{title}</h3>

      <div className="color-options">
        {colors.map((color) => (
          <button
            key={color}
            className={`color-button ${
              selectedColor === color ? "selected" : ""
            }`}
            style={{
              backgroundColor: color,
            }}
            onClick={() => onSelect(color)}
          />
        ))}
      </div>

    </div>
  );
}

export default ColorSelector;