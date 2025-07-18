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
 * MiniBar
 * ──────────────────────────────────────────────────────────
 *  orders        – tablica liczb (wymagana)
 *  visits        – tablica liczb (opcjonalna → brak drugiej serii)
 *  …pozostałe propsy bez zmian…
 */
export default function MiniBar({
  orders,
  visits,
  optionsOverride,
  ordersColor = "#5c6dff",
  visitsColor = "#26a69a",
  labels,
  width = 250,
  height = 100,
  stacked = false,
}) {
  /* ── Et ykiety X ────────────────────────────── */
  const defaultLabels = ["Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"];
  const maxLen = Math.max(orders?.length ?? 0, visits?.length ?? 0);
  const xLabels = (labels ?? defaultLabels).slice(0, maxLen);

  /* ── Budujemy datasets dynamicznie ───────────── */
  const datasets = [
    {
      label: "Zamówienia",
      data: orders,
      backgroundColor: ordersColor,
      barPercentage: 0.48,
      categoryPercentage: 1.0,
      borderRadius: 4,
    },
  ];

  /* jeśli przekazano visits i są > 0 – dodaj drugą serię */
  if (Array.isArray(visits) && visits.some((v) => v > 0)) {
    datasets.push({
      label: "Umówienia",
      data: visits,
      backgroundColor: visitsColor,
      barPercentage: 0.48,
      categoryPercentage: 1.0,
      borderRadius: 4,
    });
  }

  const chartData = { labels: xLabels, datasets };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    layout: { padding: { left: 4, right: 4 } },
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { stacked, offset: true, grid: { display: false } },
      y: { display: false, stacked, grid: { display: false } }
    },
    ...optionsOverride
  };

 
  return <Bar data={chartData} options={options} width={width} height={height} />;
}
