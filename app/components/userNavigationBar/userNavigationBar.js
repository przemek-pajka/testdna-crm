'use client'
import styles from './userNavigationBar.module.css'

import { useRouter } from 'next/navigation'

export const UserNavigationBar = () => {
    const router = useRouter()

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })          // wysyłamy żądanie
    router.refresh()                                        // czyścimy cache/SSR (Next 14+)
    router.push('/')                                   // przekierowanie na stronę logowania
  }


  return (
    <div className={`${styles.userNavigationBar} shadow-lg`}>
      <div>
       <img className='inline-block' src="https://cdn-icons-png.flaticon.com/512/3031/3031293.png" width="24" height="24"/> 
        <input className='p-5' type="text" placeholder='Wyszukaj'/>  
      </div>
       
       <div className='flex align-items-center'>
        <button className='btn--danger mr-3' onClick={handleLogout}>Wyloguj</button>
        <button><img className="rounded-[50%]" width="40" height="40" src="https://demos.pixinvent.com/vuexy-html-admin-template/assets/img/avatars/1.png"/></button>
       </div>
        
    </div>
)
}
