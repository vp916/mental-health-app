import Placeholder from "../components/Placeholder.jsx";

export default function JournalEditor() {
  return (
    <Placeholder
      title="Journal entry"
      owner="Person B"
      todo={[
        "Title, body, emotion tag",
        "/journal/new creates, /journal/:id edits",
        "Delete button with an in-page confirm",
      ]}
    />
  );
}
