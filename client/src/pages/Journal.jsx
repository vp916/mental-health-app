import Placeholder from "../components/Placeholder.jsx";

export default function Journal() {
  return (
    <Placeholder
      title="Journal"
      owner="Person B"
      todo={[
        "List my entries, newest first",
        "Search box (GET /api/journal?q=)",
        "Button to /journal/new",
      ]}
    />
  );
}
