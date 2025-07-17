// app/api/statystyki/route.js
import db from "@/lib/db";

/**
 * GET /api/statystyki?start=YYYY-MM-DD&end=YYYY-MM-DD
 * Zwraca: { wizyty, zamowienia, suma_pln, zamowienia_meta }
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end   = searchParams.get("end");

  // Walidacja – obie daty wymagane i w formacie YYYY-MM-DD
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (!start || !end || !iso.test(start) || !iso.test(end)) {
    return Response.json({ message: "Niepoprawny zakres dat" }, { status: 400 });
  }

  try {
    /* 1️⃣  Wizyty */
    const [[{ wizyty }]] = await db.query(
      `SELECT COUNT(*) AS wizyty
         FROM wizyty_dna
        WHERE DATE(post_date) BETWEEN ? AND ?`,
      [start, end]
    );

    /* 2️⃣  Zamówienia WooCommerce – liczymy statusy 'wc-completed' itp. */
    /* 2️⃣  Zamówienia WooCommerce – status 'wc-processing' */
const [[{ zamowienia, suma_pln }]] = await db.query(
  `SELECT COUNT(z.ID) AS zamowienia,
       COALESCE(SUM(CAST(m.meta_value AS DECIMAL(10,2))),0) AS suma_pln
  FROM zamowienia_woocommerce         z
  LEFT JOIN zamowienia_woocommerce_meta m
         ON m.order_id = z.ID
        AND m.meta_key = '_order_total'
 WHERE DATE(z.post_date) BETWEEN ? AND ?
   AND z.post_status = 'wc-processing';`,
  [start, end]
);


    /* 3️⃣  Zamówienia meta – np. z meta_key='_formularz' */
/* 3️⃣  Liczba zamówień z formularza */
const [[{ zamowienia_meta }]] = await db.query(
  `SELECT COUNT(DISTINCT z.ID) AS zamowienia_meta
  FROM zamowienia_woocommerce         z
  JOIN zamowienia_woocommerce_meta    m
    ON m.order_id = z.ID
   AND m.meta_key = '_formularz'
 WHERE DATE(z.post_date) BETWEEN ? AND ?
   AND z.post_status = 'wc-processing';`,
  [start, end]
);


    return Response.json({
      wizyty,
      zamowienia,
      suma_pln,
      zamowienia_meta,
    });
  } catch (err) {
    console.error("MySQL error:", err);
    return Response.json({ message: "Błąd serwera" }, { status: 500 });
  }
}
