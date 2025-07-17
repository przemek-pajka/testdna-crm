// app/api/zamowienia/route.js
import db from "@/lib/db";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end   = searchParams.get("end");
  const rows = await db.query(
    `SELECT z.ID           AS id,
            i.meta_value    AS product,      -- jeśli trzymasz nazwę w meta
            z.item_qty      AS qty,          -- pole z ilością
            t.order_total   AS amount,       -- suma PLN
            'Zamówienie online' AS source,   -- lub wyczytaj z meta
            z.source        AS site          -- 'testdna.pl' / 'centrumdna.pl'
       FROM zamowienia_woocommerce z
       WHERE DATE(z.post_date) BETWEEN ? AND ?`,
    [start, end]
  );
  return Response.json(rows[0]);
}
