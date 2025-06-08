'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Witaj, użytkowniku!</p>
      <button onClick={handleLogout}>Wyloguj</button>
    

    {/* ProfileCard */}
      <div>
        <div className="flex items-center gap-2">
          <Image alt="" src="https://demos.pixinvent.com/vuexy-html-admin-template/assets/img/avatars/1.png" width="40" height="40"/>
          John Doe
        </div>
      </div>
    {/* ProfileCard */}

    </div>
  )
}
