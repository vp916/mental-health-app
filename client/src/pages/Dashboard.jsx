import { useAuth } from "../context/AuthContext.jsx";
import Placeholder from "../components/Placeholder.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Placeholder
      title={`Hi, ${user.name}`}
      owner="Person A"
      todo={[
        "Mood chart for the last 7 days (Chart.js)",
        "Streak: days in a row with a mood entry",
        "Last 3 journal entries",
        "Latest check-in result",
        "Daily affirmation (pick one from a list)",
        "Bookmarked resources",
        "Nudge if today's mood isn't logged yet",
      ]}
    />
  );
}
