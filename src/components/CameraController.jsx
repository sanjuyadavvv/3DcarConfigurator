import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const carCenter = [-0.195, 0.588, -0.27];
const dist = 4.89 * 1.4; // ~6.85, based on the longest dimension (length)

const views = {
  front: {
    position: [carCenter[0], carCenter[1] + 0.3, carCenter[2] + dist],
    lookAt: carCenter,
  },
  side: {
    position: [carCenter[0] + dist, carCenter[1] + 0.3, carCenter[2]],
    lookAt: carCenter,
  },
  rear: {
    position: [carCenter[0], carCenter[1] + 0.3, carCenter[2] - dist],
    lookAt: carCenter,
  },
  top: {
    position: [carCenter[0], carCenter[1] + dist, carCenter[2]],
    lookAt: carCenter,
  },
  default: {
    position: [carCenter[0] + dist * 0.7, carCenter[1] + dist * 0.4, carCenter[2] + dist * 0.7],
    lookAt: carCenter,
  },
};

function CameraController({ view, controlsRef }) {
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3(5, 2, 5));
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const isTransitioning = useRef(false);

  // Only set new targets + start transitioning when `view` actually changes
  useEffect(() => {
    const selectedView = views[view] || views.default;
    targetPosition.current.set(...selectedView.position);
    targetLookAt.current.set(...selectedView.lookAt);
    isTransitioning.current = true;
  }, [view]);

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