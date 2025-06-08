import styles from './userNavigationBar.module.css'

export const UserNavigationBar = () => (
    <div className={`${styles.userNavigationBar} shadow-lg`}>
      <div>
       <img className='inline-block' src="https://cdn-icons-png.flaticon.com/512/3031/3031293.png" width="24" height="24"/> 
        <input className='p-5' type="text" placeholder='Wyszukaj'/>  
      </div>
       
       
        <button><img className="rounded-[50%]" width="40" height="40" src="https://demos.pixinvent.com/vuexy-html-admin-template/assets/img/avatars/1.png"/></button>
    </div>
)