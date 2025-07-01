export async function POST(request) {
  const { email, password } = await request.json()


  // if (true) {
   if (email === 'biuro@testdna.pl' && password === 'm3Zc96C') {
    const response = new Response(JSON.stringify({ success: true }))
    response.headers.set('Set-Cookie', 'auth=true; Path=/; HttpOnly')
    return response
  }

  return new Response(JSON.stringify({ success: false }), { status: 401 })
}
