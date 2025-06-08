import styles from './sidebar.module.css';
import Image from 'next/image';

export const Sidebar = () => (
    <div className={styles.sidebar}>
        <Image width="202" height="67" src="https://www.testdna.pl/img/LOGO-testdna.svg"/>
        <ul className={styles.servicesListSidebar}>
            <li className={styles.active}>eCommerce</li>
        </ul>
      
    </div>
)