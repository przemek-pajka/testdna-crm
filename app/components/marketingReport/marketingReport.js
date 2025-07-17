/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "../card/card";
import MiniBar from "../miniBar/miniBar"; // wersja z propsami {orders, visits,...}
import "chart.js/auto"; // Pie chart

// Lazy-load Pie from react-chartjs-2
const Pie = dynamic(() => import("react-chartjs-2").then((m) => m.Pie), {
  ssr: false,
});

/**
 * MarketingReport
 *  • zakres dat (start → end)
 *  • pobiera zagregowane statystyki z /api/statystyki
 *  • kafle: zamówienia, formularze, suma PLN, średnia
 *  • wykresy (Pie + MiniBar demo/mocks — łatwo podmienić na dane z API)
 *  • tabela ostatnich zamówień (demo/mocks)
 */
export default function MarketingReport({ classes = "" }) {
  /* Zakres dat – ustaw dowolne wartości start/end */
  const [dateRange, setDateRange] = useState({
    start: "2025-06-01",
    end: "2025-06-12",
  });

  /* Statystyki z API */
  const [stats, setStats] = useState({
    wizyty: 0,
    zamowienia: 0,
    suma_pln: 0,
    zamowienia_meta: 0, // traktujemy jako "formularze"
  });

  /* Pobieraj dane przy każdej zmianie dat */
  useEffect(() => {
    async function fetchStats() {
      try {
        const url = `/api/statystyki?start=${dateRange.start}&end=${dateRange.end}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setStats({
          wizyty: json.wizyty ?? 0,
          zamowienia: json.zamowienia ?? 0,
          suma_pln: json.suma_pln ?? 0,
          zamowienia_meta: json.zamowienia_meta ?? 0,
        });
      } catch (err) {
        console.error("Błąd pobierania statystyk:", err);
      }
    }
    fetchStats();
  }, [dateRange]);

    /* ─────────── Lista zamówień do tabeli ─────────── */
  const [orders, setOrders] = useState([]); // <= NEW

  /* Fetch agregatów */
  useEffect(() => {
    async function fetchStats() {
      try {
        const url = `/api/statystyki?start=${dateRange.start}&end=${dateRange.end}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setStats({
          wizyty: json.wizyty ?? 0,
          zamowienia: json.zamowienia ?? 0,
          suma_pln: json.suma_pln ?? 0,
        });
      } catch (err) {
        console.error("Błąd pobierania statystyk:", err);
      }
    }
    fetchStats();
  }, [dateRange]);

   /* Fetch LISTY zamówień */
  useEffect(() => {
    async function fetchOrders() {
      try {
        const url = `/api/zamowienia?start=${dateRange.start}&end=${dateRange.end}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json(); // expecting array
        setOrders(json);
        console.log(orders)
      } catch (err) {
        console.error("Błąd pobierania zamówień:", err);
        setOrders([]);
      }
    }
    fetchOrders();
  }, [dateRange]);

  /* Handlery pól daty */
  const handleDateChange = (key) => (e) =>
    setDateRange((prev) => ({ ...prev, [key]: e.target.value }));

  /* Formatowanie kwoty (proste) */
  const formatPLN = (v) =>
    typeof v === "number"
      ? `${v.toLocaleString("pl-PL", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })} zł`
      : v;

  /* ── Dane wykresów demo (podmień na dane z API, gdy będą dostępne) ── */
  const portalData = {
    labels: ["Prekoncepcja.pl", "Poroniłam.pl", "Genetyczne.pl", "Inne"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ["#5865ff", "#ff5660", "#22c55e", "#f9ae16"],
      },
    ],
  };
  const pieOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  const typeLabels = ["KIR - HLA-C", "Kariotyp", "Trombofilia", "MTHFR"];
  const typeData = [120, 90, 100, 70]; // demo: liczby zamówień wg typu badania

  /* Jeśli chcesz pokazać tylko jedną serię (zamówienia) w MiniBar,
     przekaż zero-tablicę jako visits: */
  const emptyVisits = Array(typeData.length).fill(0);

  /* Średnia wartość zamówienia */
  const avg =
    stats.zamowienia > 0
      ? `${Math.round(stats.suma_pln / stats.zamowienia)} zł`
      : "—";

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
          { value: stats.zamowienia, label: "Liczba zamówień" },
          { value: stats.wizyty, label: "Liczba formularzy" },
          { value: formatPLN(stats.suma_pln), label: "Suma PLN" },
          { value: avg, label: "Średnia wartość zamówienia" },
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
          {/* Demo: jedna seria (zamówienia) → visits = same zera */}
          <MiniBar
            orders={typeData}
            visits={emptyVisits}
            labels={typeLabels}
            width={320}
            height={270}
            ordersColor="#5c6dff"
            visitsColor="rgba(0,0,0,0)" // ukryj zieloną serię
          />
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
            {console.log(orders)}
            {orders.map((r) => (
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
