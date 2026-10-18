import Placeholder from "../../components/Placeholder.jsx";

export default function AdminHome() {
  return (
    <Placeholder
      title="Admin"
      owner="Person D"
      todo={[
        "Counts from GET /api/admin/stats",
        "Links to resources, reports, users",
      ]}
    />
  );
}
