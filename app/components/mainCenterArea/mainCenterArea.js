const { UserNavigationBar } = require("../userNavigationBar/userNavigationBar")
import MiniBar from "../miniBar/miniBar"
import { Card } from "../card/card"
import styles from "./mainCenterArea.module.css"

  const lastWeek = [38, 52, 14, 30, 46, 22, 60];

export const MainCenterArea = () => (
    <div className={styles.mainCenterArea}>
        <UserNavigationBar/>
        <Card classes="inline-flex flex-col justify-around mr-6">
            <div>
                <span className="font-bold">Zamówienia</span>
                <p className="cardDate">Ostatni tydzień</p>
            </div>
                 <MiniBar data={lastWeek} barColor="#5c6dff"   // fiolet
  bgColor="#c8e6c9"    />

        <div className="stats-col text-sm mt-5">
            <div className="flex items-center"><span className="circ circ-orders"></span>Zamówienia: 125</div>
            <div className="flex items-center"><span className="circ circ-appointments"></span>Umówienia formularze: 87</div>
        </div>
        </Card>


               <Card classes="inline-flex flex-col justify-around">
            <div>
                <span className="font-bold">Zamówienia</span>
                <p className="cardDate">Bieżący tydzień</p>
            </div>
                 <MiniBar data={lastWeek} barColor="#5c6dff"   // fiolet
  bgColor="#c8e6c9"    />

        <div className="stats-col text-sm mt-5">
            <div className="flex items-center"><span className="circ circ-orders"></span>Zamówienia: 153</div>
            <div className="flex items-center"><span className="circ circ-appointments"></span>Umówienia formularze: 63</div>
        </div>
        </Card>


        <Card classes="mt-8">
           <div className="font-bold">Raport marketingowy</div>
           <div className="flex gap-5 mt-5">
                <div className="small-box">
                    <div className="small-box__amount">32</div>
                    <div className="small-box__description">Liczba zamówień</div>
                </div>
                  <div className="small-box">
                    <div className="small-box__amount">10</div>
                    <div className="small-box__description">Liczba formularzy</div>
                </div>
                  <div className="small-box">
                    <div className="small-box__amount">9 400</div>
                    <div className="small-box__description">Suma PLN</div>
                </div>
                  <div className="small-box">
                    <div className="small-box__amount">293 zł</div>
                    <div className="small-box__description">Średnia wartość zamówienia</div>
                </div>
           </div>
        </Card>

    </div>  
)