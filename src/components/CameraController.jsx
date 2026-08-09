import { useEffect } from "react";

function CameraController({
  bounds,
  controlsRef,
}) {
  useEffect(() => {
    if (!bounds || !controlsRef.current) return;

    const controls = controlsRef.current;
    const camera = controls.object;

    const [x, y, z] = bounds.center;

    // Keep camera fixed.
    camera.position.set(
      x,
      y + 2,
      z + 10
    );

    controls.target.set(
      x,
      y,
      z
    );

    controls.update();

  }, [bounds, controlsRef]);

  return null;
}

export default CameraController;