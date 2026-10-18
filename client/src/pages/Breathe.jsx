import BreathingCircle from "../components/BreathingCircle.jsx";

export default function Breathe() {
  return (
    <div className="container py-5 text-center">
      <h1 className="h2 mb-2">Box breathing</h1>
      <p className="text-secondary mb-5">Follow the circle. Two or three minutes is enough to slow things down.</p>
      <BreathingCircle />
    </div>
  );
}
