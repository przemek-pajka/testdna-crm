'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError('Nieprawidłowe dane logowania')
    }
  }

  return (
    <div className="min-h-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-2 flex flex-col justify-center items-center shadow-lg mx-auto p-5">
        <h1 className="text-3xl font-bold underline mb-4">Logowanie</h1>
      <form className="flex flex-col gap-4 bg-gray-100" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="p-2 bg-white border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Hasło"
          className="p-2 bg-white border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded">Zaloguj</button>
      </form>
      {error && <p>{error}</p>}
      </div>
    </div>
  )
}
