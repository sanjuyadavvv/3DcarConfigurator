import { useProgress } from "@react-three/drei";

function LoadingScreen() {
  const { progress, active } = useProgress();

  if (!active && progress >= 100) {
    return null;
  }

  return (
    <div className="loading-screen">

      <div className="loading-content">

        <p className="loading-brand">
          AUTOMOBILI LAMBORGHINI
        </p>

        <div className="loading-number">
          {Math.round(progress)}
        </div>

        <p className="loading-text">
          LOADING EXPERIENCE
        </p>

        <div className="loading-line">

          <div
            className="loading-line-progress"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default LoadingScreen;