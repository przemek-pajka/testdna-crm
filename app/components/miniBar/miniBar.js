import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

// Rejestracja wymaganych modułów Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// Import <Bar> tylko po stronie klienta (Next.js)
const Bar = dynamic(
  () => import("react-chartjs-2").then((m) => m.Bar),
  { ssr: false }
);

/**
 * MiniBar – wykres słupkowy z DWOMA seriami:
 *   • tło (bgData / bgColor)
 *   • główne słupki (data / barColor)
 *
 * Props
 * ────────────────────────────────────────────────
 *  data      – wartości główne (wierzchnie słupki)
 *  bgData    – wartości tła (opcjonalnie; fallback ≈70 % głównych)
 *  barColor  – kolor głównych słupków (domyślnie fiolet #5c6dff)
 *  bgColor   – kolor tła (domyślnie szary #e5e5e5)
 *  labels    – etykiety osi X (domyślnie "Pn–Nd")
 *  width     – szerokość canvasa w px (domyślnie 250)
 *  height    – wysokość canvasa w px (domyślnie 100)
 */
export default function MiniBar({
  data,
  bgData,
  barColor = "#5c6dff",
  bgColor = "#e5e5e5",
  labels,
  width = 250,
  height = 100,
}) {
  /* ─────────── Dane główne (foreground) ─────────── */
  const mainValues = data ?? [38, 52, 14, 30, 46, 22, 60];

  /* ─────────── Dane tła (background) ─────────── */
  const autoBg = mainValues.map((v) =>
    // ~70 % wartości + losowa fluktuacja (±5)
    Math.max(4, Math.round(v * 0.7 + (Math.random() * 10 - 5)))
  );
  const shadowValues = (bgData ?? autoBg).slice(0, mainValues.length);

  /* ─────────── Etykiety X ─────────── */
  const defaultLabels = ["Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"];
  const xLabels = (labels ?? defaultLabels).slice(0, mainValues.length);

  /* ─────────── Konfiguracja Chart.js ─────────── */
  const chartData = {
    labels: xLabels,
    datasets: [
      /* TŁO */
      {
        label: "Umówienia formularze",
        data: shadowValues,
        backgroundColor: bgColor,
        barPercentage: 0.58,
        categoryPercentage: 1.0,
        borderRadius: 4,
      },
      /* GŁÓWNE SŁUPKI */
      {
        label: "Zamówienia",
        data: mainValues,
        backgroundColor: barColor,
        barPercentage: 0.58,
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
      tooltip: {
        enabled: true, // pokaż tooltip dla obu serii
        mode: "index", // przy jednym hover – oba punkty
        intersect: false,
      },
    },
    scales: {
      x: {
        offset: true,
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          padding: 4,
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: { display: false, grid: { display: false } },
    },
  };

  /* ─────────── Render wykresu ─────────── */
  return <Bar data={chartData} options={options} width={width} height={height} />;
}
