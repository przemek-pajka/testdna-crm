export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Set-Cookie': 'auth=; Path=/; HttpOnly; Max-Age=0',
      'Content-Type': 'application/json',
    },
  })
}
