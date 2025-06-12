/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Card } from "../card/card";
import dynamic from "next/dynamic";
import MiniBar from "../miniBar/miniBar";
import "chart.js/auto"; // pie chart

// Lazy‑load Pie from react-chartjs-2
const Pie = dynamic(() => import("react-chartjs-2").then((m) => m.Pie), {
  ssr: false,
});

/**
 * MarketingReport component
 * – statystyki zamówień / formularzy
 * – wykresy (Pie + MiniBar)
 * – tabela ostatnich zamówień
 * – picker zakresu dat (start → end)
 */
export default function MarketingReport({ classes = "" }) {
  /**
   * Zakres dat – domyślnie ostatnie 12 dni czerwca 2025.
   * W przyszłości dateRange może służyć do pobierania danych z API.
   */
  const [dateRange, setDateRange] = useState({
    start: "2025-06-01",
    end: "2025-06-12",
  });

  // Handler, który aktualizuje odpowiedni klucz w state
  const handleDateChange = (key) => (e) =>
    setDateRange((prev) => ({ ...prev, [key]: e.target.value }));

  // ────────── Chart data & options ──────────
  const portalData = {
    labels: ["Prekoncepcja.pl", "Poroniłam.pl", "Genetyczne.pl", "Inne"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ["#5865ff", "#ff5660", "#22c55e", "#f9ae16"],
      },
    ],
  };
 const badaniaLabels = ["KIR - HLA-C", "Kariotyp", "Trombofilia", "MTHFR"]

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  const typeData = [120, 90, 100, 70];

  const rows = [
    {
      id: 12354,
      product: "KIR + HLA C",
      qty: 1,
      amount: "300 zł",
      source: "Zamówienie online",
    },
    {
      id: 12353,
      product: "Kariotyp",
      qty: 1,
      amount: "200 zł",
      source: "Zamówienie online",
    },
    {
      id: 12352,
      product: "Trombofilia",
      qty: 1,
      amount: "250 zł",
      source: "Zamówienie online",
    },
    {
      id: 12351,
      product: "KIR + HLA C",
      qty: 1,
      amount: "300 zł",
      source: "Zamówienie online",
    },
    {
      id: 10012,
      product: "KIR + HLA C",
      qty: 1,
      amount: "—",
      source: "Formularz",
    },
    {
      id: 10011,
      product: "Kariotyp",
      qty: 1,
      amount: "—",
      source: "Formularz",
    },
  ];

  return (
    <Card classes={classes}>
      {/* ── Nagłówek ─────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl">Raport marketingowy</h2>

        {/* Picker zakresu dat */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={handleDateChange("start")}
            className="border border-gray-200 rounded-md px-3 py-1 text-sm shadow"
          />
          <span className="text-gray-500">—</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={handleDateChange("end")}
            className="border border-gray-200 rounded-md px-3 py-1 text-sm shadow"
          />
        </div>
      </div>

      {/* ── Statystyki ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
        {[
          { value: 32, label: "Liczba zamówień" },
          { value: 10, label: "Liczba formularzy" },
          { value: "9 400 zł", label: "Suma PLN" },
          { value: "293 zł", label: "Średnia wartość zamówienia" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center border border-gray-200 rounded-md p-2.5"
          >
            <span className="text-2xl font-semibold">{s.value}</span>
            <span className="text-sm text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Wykresy ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Pie */}
        <div className="aspect-square relative h-80 p-4 border border-gray-200 rounded-md">
          <h3 className="mb-2 font-medium text-sm">Rozkład wg portalu</h3>
          <Pie data={portalData} options={pieOptions} height={230} />
        </div>

        {/* MiniBar */}
        <div className="aspect-square relative h-80 p-4 border border-gray-200 rounded-md">
          <h3 className="mb-2 font-medium text-sm">Rozkład wg typu badania</h3>
          {/* Możesz precyzyjnie kontrolować rozmiar przez propsy width/height */}
          
          <MiniBar data={typeData} width={320} height={270} labels={badaniaLabels}/>
        </div>
      </div>

      {/* ── Tabela zamówień ─────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Numer zamówienia</th>
              <th className="py-2 text-left">Produkt</th>
              <th className="py-2 text-left">Liczba sztuk</th>
              <th className="py-2 text-left">Kwota zamówienia</th>
              <th className="py-2 text-left">Źródło</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2">{r.id}</td>
                <td>{r.product}</td>
                <td>{r.qty}</td>
                <td>{r.amount}</td>
                <td>{r.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
