// app/api/wizyty/last7/route.js
import db from "@/lib/db";

export async function GET() {
    const TZ = "+00:00";
  try {
    /* 7 ostatnich dni licząc od DZISIAJ (bez dzisiejszego czasu, więc północ-północ)  */
     /* ——— 1. SQL: liczba wizyt w każdym dniu poprzedniego tygodnia ——— */
const [rows] = await db.query(`
  /* ---------------- podzapytanie: lokalna DATA ---------------- */
  WITH local AS (
    SELECT DATE(CONVERT_TZ(post_date,'+00:00', ?)) AS d_pl
    FROM   wizyty_dna
  ),
  /* ---------------- granice poprzedniego tygodnia ------------- */
  bounds AS (
    SELECT
      DATE_SUB(DATE(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00', ?)),
               INTERVAL WEEKDAY(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00', ?)) + 7 DAY
      ) AS start_pl,                   -- pn 00:00 PL poprzedniego tygodnia
      DATE_SUB(DATE(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00', ?)),
               INTERVAL WEEKDAY(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00', ?)) + 1 DAY
      ) AS end_pl                      -- nd 23:59 PL
  )
  SELECT
    WEEKDAY(d_pl) AS dow,              -- 0 = pon, …, 6 = nd
    COUNT(*)      AS cnt
  FROM   local, bounds
  WHERE  d_pl BETWEEN bounds.start_pl AND bounds.end_pl
  GROUP  BY dow
  ORDER  BY dow;
`, [TZ, TZ, TZ, TZ, TZ, TZ]);

    // Zamieniamy wynik SQL → [0,0,0,0,0,0,0] z liczbami w odpowiednich slotach
     /* ——— 2. SQL → tablica 7 liczb (Pon=0 … Nd=6) ——— */
  const result = Array(7).fill(0);
  rows.forEach(({ dow, cnt }) => { result[dow] = cnt; });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("MySQL error:", err);
    return new Response(JSON.stringify({ message: "Błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
