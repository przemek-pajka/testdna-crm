const { UserNavigationBar } = require("../userNavigationBar/userNavigationBar")
import MiniBar from "../miniBar/miniBar"
import { Card } from "../card/card"
import styles from "./mainCenterArea.module.css"

  const lastWeek = [38, 52, 14, 30, 46, 22, 60];

export const MainCenterArea = () => (
    <div className={styles.mainCenterArea}>
        <UserNavigationBar/>
        <Card>
            Zamówienia
            <p className="cardDate">Ostatni tydzień</p>
                 <MiniBar data={lastWeek} />
        </Card>
    </div>  
)