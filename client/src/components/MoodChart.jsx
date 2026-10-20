import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function MoodChart({ entries }) {
  // "T00:00" makes the browser read "2026-10-20" as local midnight, so the label shows the right day.
  const data = {
    labels: entries.map((e) => new Date(`${e.entry_date}T00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" })),
    datasets: [
      { label: "Mood", data: entries.map((e) => e.mood), borderColor: "#6d4fc9", backgroundColor: "#6d4fc9", tension: 0.3 },
      { label: "Stress", data: entries.map((e) => e.stress), borderColor: "#d39a1e", backgroundColor: "#d39a1e", tension: 0.3 },
      { label: "Energy", data: entries.map((e) => e.energy), borderColor: "#4f7fd9", backgroundColor: "#4f7fd9", tension: 0.3 },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { min: 1, max: 5, ticks: { stepSize: 1 } } },
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <div style={{ height: "260px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
