// components/ColorTargetSelector.jsx
function ColorTargetSelector({ activeTarget, onChange }) {
  const targets = [
    {
      key: "body",
      label: "Body Color",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z"
          />
        </svg>
      ),
    },
    {
      key: "wheels",
      label: "Wheel Color",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          <path
            stroke="currentColor"
            strokeWidth="1.5"
            d="M12 12L12 4M12 12L18.9 8M12 12L18.9 16M12 12L12 20M12 12L5.1 16M12 12L5.1 8"
          />
        </svg>
      ),
    },
    {
      key: "glass",
      label: "Glass Tint",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M4 6h16l-2 5H6L4 6zm3 7h10v5H7v-5z" opacity="0.8" />
        </svg>
      ),
    },
  ];

  return (
    <div className="target-selector">
      {targets.map((t) => (
        <button
          key={t.key}
          className={activeTarget === t.key ? "active" : ""}
          title={t.label}
          onClick={() => onChange(t.key)}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

export default ColorTargetSelector;