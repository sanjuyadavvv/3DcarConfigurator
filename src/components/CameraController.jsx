import { useEffect, useRef } from "react";
import { useCallback } from "react";
function CameraController({ bounds, controlsRef, padding = 1.2, onReady }) {
  const hasFitted = useRef(false);

  useEffect(() => {
    if (!bounds || !controlsRef.current || hasFitted.current) return;

    const controls = controlsRef.current;
    const camera = controls.object;

    const center = bounds.center;
    const size = bounds.size;

    const maxSize = Math.max(size.x, size.y, size.z);
    const fov = camera.fov;
    const fitHeightDistance = (maxSize / 2) / Math.tan((fov * Math.PI) / 360);
    const distance = fitHeightDistance * padding;

    camera.position.set(center.x, center.y + Math.max(size.y * 0.25, 1), center.z + distance);
    controls.target.set(center.x, center.y, center.z);
    controls.update();

    hasFitted.current = true;
    onReady?.();
  }, [bounds, controlsRef, padding, onReady]);

  return null;
}

export default CameraController;