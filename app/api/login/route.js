export async function POST(request) {
  const { email, password } = await request.json()


  if (true) {
  // if (email === 'admin@testdna.pl' && password === 'pass') {
    const response = new Response(JSON.stringify({ success: true }))
    response.headers.set('Set-Cookie', 'auth=true; Path=/; HttpOnly')
    return response
  }

  return new Response(JSON.stringify({ success: false }), { status: 401 })
}
