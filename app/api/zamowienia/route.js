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
    SELECT z.ID                                            AS id,

       /* nazwa produktu z wp_posts */
      GROUP_CONCAT( DISTINCT p.post_title ORDER BY p.post_title SEPARATOR '; ' ) AS product,

       /* suma ilości wszystkich pozycji */
       SUM(CASE WHEN q.meta_key = '_qty'
                THEN CAST(q.meta_value AS UNSIGNED)
                ELSE 0 END)                            AS qty,

       /* suma kwot pozycji – fallback, jeśli brak _order_total w postmeta */
       COALESCE(t.meta_value,
                SUM(CASE WHEN l.meta_key = '_line_total'
                         THEN CAST(l.meta_value AS DECIMAL(10,2))
                         ELSE 0 END))                  AS amount,

       'Zamówienie online'                             AS source,
       COALESCE(s.meta_value,'—')                      AS site

FROM   zamowienia_woocommerce               z

/* postmeta: _order_total  */
LEFT   JOIN zamowienia_woocommerce_meta      t
       ON t.order_id = z.ID
      AND t.meta_key = '_order_total'

/* postmeta: _source_site  */
LEFT   JOIN zamowienia_woocommerce_meta      s
       ON s.order_id = z.ID
      AND s.meta_key = '_source_site'

/* pozycje line_item */
LEFT   JOIN dufo_woocommerce_order_items     oi
       ON oi.order_id        = z.ID
      AND oi.order_item_type = 'line_item'

/* meta ilości (_qty) */
LEFT   JOIN dufo_woocommerce_order_itemmeta  q
       ON q.order_item_id = oi.order_item_id
      AND q.meta_key      = '_qty'

/* meta kwoty (_line_total) */
LEFT   JOIN dufo_woocommerce_order_itemmeta  l
       ON l.order_item_id = oi.order_item_id
      AND l.meta_key      = '_line_total'

/* meta _product_id  →  nazwa z wp_posts */
LEFT   JOIN dufo_woocommerce_order_itemmeta  pid
       ON pid.order_item_id = oi.order_item_id
      AND pid.meta_key      = '_product_id'
LEFT   JOIN produkty_testdna                            p
       ON p.ID = pid.meta_value                 -- post_title = nazwa produktu

WHERE  DATE(z.post_date) BETWEEN ? AND ?
  AND  z.post_status LIKE 'wc-processing%'

GROUP  BY z.ID
ORDER  BY z.post_date DESC;

    `,
    [start, end, limit]
  );

  return Response.json(rows);
}
