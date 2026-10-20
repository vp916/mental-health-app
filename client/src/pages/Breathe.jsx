import BreathingCircle from "../components/BreathingCircle.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function Breathe() {
  return (
    <div className="container py-5">
      <PageHeader title="Box breathing" text="Follow the orb. Two or three minutes is enough to slow things down." />
      <BreathingCircle />
    </div>
  );
}
