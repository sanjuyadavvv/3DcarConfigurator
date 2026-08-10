// components/SpectrumPicker.jsx
import { useRef } from "react";
import { getColorAtPosition, SPECTRUM_CSS_GRADIENT } from "../utils/Specturum"

function SpectrumPicker({ position, onChange }) {
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  const updateFromClientX = (clientX) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pos = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onChange(pos, getColorAtPosition(pos));
  };

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    e.target.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e) => {
    draggingRef.current = false;
    e.target.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={trackRef}
      className="spectrum-track"
      style={{ background: SPECTRUM_CSS_GRADIENT }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="spectrum-handle" style={{ left: `${position * 100}%` }} />
    </div>
  );
}

export default SpectrumPicker;