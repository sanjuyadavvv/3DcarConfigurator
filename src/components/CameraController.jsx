import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

// Builds camera views from the model's actual measured bounds instead of
// hardcoded numbers, so a new/different GLB doesn't need manual retuning.
function computeViews(bounds) {
  const center = bounds?.center ?? [0, 1, 0];
  const size = bounds?.size ?? [2, 2, 2];
  const dist = Math.max(size[0], size[1], size[2]) * 1.4;
  const eyeHeight = center[1] + size[1] * 0.15;

  return {
    front: {
      position: [center[0], eyeHeight, center[2] + dist],
      lookAt: center,
    },
    side: {
      position: [center[0] + dist, eyeHeight, center[2]],
      lookAt: center,
    },
    rear: {
      position: [center[0], eyeHeight, center[2] - dist],
      lookAt: center,
    },
    top: {
      position: [center[0], center[1] + dist, center[2]],
      lookAt: center,
    },
    default: {
      position: [
        center[0] + dist * 0.7,
        center[1] + dist * 0.4,
        center[2] + dist * 0.7,
      ],
      lookAt: center,
    },
  };
}

function CameraController({ view, bounds, controlsRef }) {
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3(5, 2, 5));
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const isTransitioning = useRef(false);

  const views = useMemo(() => computeViews(bounds), [bounds]);

  // Only set new targets + start transitioning when `view` or the model's
  // bounds actually change (e.g. a new GLB just finished loading)
  useEffect(() => {
    if (!bounds) return; // wait until the model's real size is known
    const selectedView = views[view] || views.default;
    targetPosition.current.set(...selectedView.position);
    targetLookAt.current.set(...selectedView.lookAt);
    isTransitioning.current = true;
  }, [view, views, bounds]);

  useFrame((state, delta) => {
    if (!isTransitioning.current) return; // hand full control to OrbitControls

    const t = 1 - Math.pow(0.001, delta);
    camera.position.lerp(targetPosition.current, t);

    if (controlsRef?.current) {
      controlsRef.current.target.lerp(targetLookAt.current, t);
      controlsRef.current.update();
    } else {
      camera.lookAt(targetLookAt.current);
    }

    // Stop once close enough to target — release control back to OrbitControls
    const posDist = camera.position.distanceTo(targetPosition.current);
    const lookAtDist = controlsRef?.current
      ? controlsRef.current.target.distanceTo(targetLookAt.current)
      : 0;

    if (posDist < 0.01 && lookAtDist < 0.01) {
      isTransitioning.current = false;
    }
  });

  return null;
}

export default CameraController;
