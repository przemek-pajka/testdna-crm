// app/api/wizyty/route.js
import db from '@/lib/db';

export async function GET(request) {
  try {
    const [rows] = await db.query('SELECT * FROM wizyty_dna');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Błąd MySQL:', error);
    return new Response(JSON.stringify({ message: 'Błąd serwera' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
