import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), {
  ssr: false,
});

/**
 * MiniBar – wykres słupkowy z DWIEMA seriami: zamówienia + wizyty
 *
 * Props
 * ─────────────────────────────────────────────────────────────
 *  orders        – tablica liczb „Zamówienia”  (wymagane)
 *  visits        – tablica liczb „Umówienia”   (wymagane)
 *  ordersColor   – kolor słupków zamówień      (default #5c6dff)
 *  visitsColor   – kolor słupków wizyt         (default #26a69a)
 *  labels        – etykiety osi X (default "Pn–Nd")
 *  width / height – rozmiar canvasa
 *  stacked       – czy serię rysować „stacked” (default false)
 */
export default function MiniBar({
  orders,
  visits,
  ordersColor = "#5c6dff",
  visitsColor = "#26a69a",
  labels,
  width = 250,
  height = 100,
  stacked = false,
}) {
  const defaultLabels = ["Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"];
  const xLabels = (labels ?? defaultLabels).slice(
    0,
    Math.max(orders?.length ?? 0, visits?.length ?? 0)
  );

  const chartData = {
    labels: xLabels,
    datasets: [
      {
        label: "Zamówienia",
        data: orders,
        backgroundColor: ordersColor,
        barPercentage: 0.48,
        categoryPercentage: 1.0,
        borderRadius: 4,
      },
      {
        label: "Umówienia",
        data: visits,
        backgroundColor: visitsColor,
        barPercentage: 0.48,
        categoryPercentage: 1.0,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    layout: { padding: { left: 4, right: 4 } },
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        stacked,
        offset: true,
        grid: { display: false },
        ticks: { font: { size: 10 }, padding: 4, maxRotation: 0 },
      },
      y: { display: false, stacked, grid: { display: false } },
    },
  };

  return <Bar data={chartData} options={options} width={width} height={height} />;
}
