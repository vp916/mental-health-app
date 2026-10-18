import Placeholder from "../components/Placeholder.jsx";

export default function Mood() {
  return (
    <Placeholder
      title="Mood"
      owner="Person B"
      todo={[
        "Form: mood, stress, energy (1–5), sleep hours, note",
        "Save with POST /api/mood (one entry per day, saving again updates it)",
        "Line chart of the last 30 days",
      ]}
    />
  );
}
