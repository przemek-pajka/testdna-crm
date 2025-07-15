// app/api/wizyty/this7/route.js
import db from "@/lib/db";

export async function GET() {
  const TZ = "+00:00";
  try {
    const [rows] = await db.query(`
      WITH local AS (
        SELECT DATE(CONVERT_TZ(post_date,'+00:00', ?)) AS d_pl
        FROM   zamowienia_woocommerce
      ),
      bounds AS (
        SELECT
          DATE_SUB(DATE(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00', ?)),
                   INTERVAL WEEKDAY(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00', ?)) DAY
          ) AS start_pl,
          DATE(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00', ?)) AS end_pl
      )
      SELECT
        WEEKDAY(d_pl) AS dow,
        COUNT(*)      AS cnt
      FROM   local, bounds
      WHERE  d_pl BETWEEN bounds.start_pl AND bounds.end_pl
      GROUP  BY dow
      ORDER  BY dow;
    `, [TZ, TZ, TZ, TZ]);

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
