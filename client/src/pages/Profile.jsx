import Placeholder from "../components/Placeholder.jsx";

export default function Profile() {
  return (
    <Placeholder
      title="Profile"
      owner="Person A"
      todo={[
        "Show name and email",
        "Change password (optional)",
      ]}
    />
  );
}
