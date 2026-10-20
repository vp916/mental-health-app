import { useEffect, useState } from "react";

const SECONDS_PER_STEP = 4;
const steps = ["Breathe in", "Hold", "Breathe out", "Hold"];
const faces = ["front", "back", "left", "right", "top", "bottom"];

export default function BreathingCircle() {
  const [elapsed, setElapsed] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  function handlePointerMove(e) {
    const box = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - box.left) / box.width - 0.5) * 30,
      y: ((e.clientY - box.top) / box.height - 0.5) * -30,
    });
  }

  const stepIndex = Math.floor(elapsed / SECONDS_PER_STEP) % steps.length;
  const secondsLeft = SECONDS_PER_STEP - (elapsed % SECONDS_PER_STEP);

  return (
    <div
      className="cc-breath"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ "--tilt-x": `${tilt.x}deg`, "--tilt-y": `${tilt.y}deg` }}
    >
      <div className="cc-cube-tilt" aria-hidden="true">
        <div className="cc-cube">
          {faces.map((face) => <div key={face} className={`cc-cube-face is-${face}`} />)}
        </div>
        <div className="cc-breath-circle" />
      </div>
      <div className="cc-breath-text">
        <span className="cc-breath-label" aria-live="polite">{steps[stepIndex]}</span>
        <span className="cc-breath-count" aria-hidden="true">{secondsLeft}</span>
      </div>
    </div>
  );
}
