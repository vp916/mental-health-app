import Placeholder from "../components/Placeholder.jsx";

export default function AssessmentTake() {
  return (
    <Placeholder
      title="Check-in"
      owner="Person C"
      todo={[
        "Questions from src/data/gad7.js or pss10.js",
        "Score in JS, show low / moderate / high with tips",
        "Save with POST /api/assessments",
        "Always say this is not a diagnosis",
      ]}
    />
  );
}
