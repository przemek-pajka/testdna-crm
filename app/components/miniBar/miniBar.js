import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

// rejestrujemy potrzebne “kontrolki” Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// 🔥 import react-chartjs-2 tylko w przeglądarce
const Bar = dynamic(
  () => import("react-chartjs-2").then((m) => m.Bar),
  { ssr: false }
);

export default function MiniBar({ data }) {
  // fallback – gdy nie dostaniesz danych z rodzica
  const values = data ?? [38, 52, 14, 30, 46, 22, 60];

  const chartData = {
    labels: Array(values.length).fill(""), // ukryte etykiety
    datasets: [
      {
        data: values,
        backgroundColor: "#5c6dff",   // kolor słupków
        borderRadius: 4,              // zaokrąglenie rogów
        barPercentage: 0.55,          // szerokość względna
        categoryPercentage: 1.0,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // dzięki temu ‘height’ zadziała
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { display: false, grid: { display: false } },
    },
  };

  // wysokość 60 px – dokładnie jak w Twoim mock-upie
  return <Bar data={chartData} options={options} height={60} />;
}
