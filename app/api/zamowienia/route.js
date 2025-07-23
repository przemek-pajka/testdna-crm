// app/api/zamowienia/route.js   (Next.js / Node runtime)
import db from "@/lib/db";

/**
 * GET /api/zamowienia?start=YYYY-MM-DD&end=YYYY-MM-DD&limit=20
 * Zwraca tablicę: id, product, qty, amount, source, site
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end   = searchParams.get("end");
  const limit = +(searchParams.get("limit") ?? 20);

  /* ——— główne kwerendy ——— */
  const [rows] = await db.query(
    `
   SELECT  z.ID                              AS order_id,
        TRIM(oi.order_item_name)          AS product,          -- pojedyncza pozycja
        CAST(q.meta_value AS UNSIGNED)    AS qty,              -- ilość tej pozycji
        CAST(l.meta_value AS DECIMAL(10,2)) AS amount,         -- wartość pozycji
        COALESCE(s.meta_value,'—')        AS site,
        'Zamówienie online'               AS source
FROM    zamowienia_woocommerce            z
JOIN    dufo_woocommerce_order_items       oi  ON oi.order_id = z.ID
                                              AND oi.order_item_type = 'line_item'   -- ⬅︎ filtr
LEFT    JOIN dufo_woocommerce_order_itemmeta q ON q.order_item_id = oi.order_item_id
                                              AND q.meta_key = '_qty'
LEFT    JOIN dufo_woocommerce_order_itemmeta l ON l.order_item_id = oi.order_item_id
                                              AND l.meta_key = '_line_total'
LEFT    JOIN zamowienia_woocommerce_meta     s ON s.order_id = z.ID
                                              AND s.meta_key = '_source_site'
WHERE   DATE(z.post_date) BETWEEN ? AND ?
  AND   z.post_status LIKE 'wc-processing%'
ORDER BY z.post_date DESC;

    `,
    [start, end, limit]
  );

  return Response.json(rows);
}
