"use client";


import { useEffect, useState } from "react";

const { UserNavigationBar } = require("../userNavigationBar/userNavigationBar")
import MiniBar from "../miniBar/miniBar"
import { Card } from "../card/card"
import styles from "./mainCenterArea.module.css"
import MarketingReport from "../marketingReport/marketingReport";

const EMPTY = Array(7).fill(0);

export const MainCenterArea = () => {
  const [lastWeekVisits, setLastWeekVisits] = useState(EMPTY);
  const [thisWeekVisits, setThisWeekVisits] = useState(EMPTY);

  const [lastWeekOrders, setLastWeekOrders] = useState(EMPTY);
  const [thisWeekOrders, setThisWeekOrders] = useState(EMPTY);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          resLastVisits,
          resThisVisits,
          resLastOrders,
          resThisOrders
        ] = await Promise.all([
          fetch("/api/wizyty/last7", { cache: "no-store" }),
          fetch("/api/wizyty/this7", { cache: "no-store" }),
          fetch("/api/zamowienia/last7", { cache: "no-store" }),
          fetch("/api/zamowienia/this7", { cache: "no-store" })
        ]);

        if (
          !resLastVisits.ok ||
          !resThisVisits.ok ||
          !resLastOrders.ok ||
          !resThisOrders.ok
        ) {
          throw new Error("Błąd API podczas pobierania liczników");
        }

        const [
          lastVisitsCount,
          thisVisitsCount,
          lastOrdersCount,
          thisOrdersCount
        ] = await Promise.all([
          resLastVisits.json(),
          resThisVisits.json(),
          resLastOrders.json(),
          resThisOrders.json()
        ]);

        setLastWeekVisits(lastVisitsCount);
        setThisWeekVisits(thisVisitsCount);
        setLastWeekOrders(lastOrdersCount);
        setThisWeekOrders(thisOrdersCount);

      } catch (err) {
        console.error("Błąd pobierania danych:", err);
      }
    };

    fetchCounts();
  }, []);
  
return(
    <div className={styles.mainCenterArea}>
        <UserNavigationBar/>
        <Card classes="inline-flex flex-col justify-around mr-6">
            <div>
                <span className="font-bold">Zamówienia</span>
                <p className="cardDate">Ostatni tydzień</p>
            </div>
                <MiniBar
  orders={lastWeekOrders}   // prawdziwe dane zamówień
  visits={lastWeekVisits}   // prawdziwe dane wizyt
  ordersColor="#5c6dff"
  visitsColor="#c8e6c9"
/>

        <div className="stats-col text-sm mt-5">
            <div className="flex items-center"><span className="circ circ-orders"></span>Zamówienia: { lastWeekOrders.reduce((sum, val) => sum + val, 0)} </div>
            <div className="flex items-center" style={{maxWidth: 393.16}}><span className="circ circ-appointments"></span>Umówienia formularze: { lastWeekVisits.reduce((sum, val) => sum + val, 0)} (Rzeczywista wartość - DANE W BAZIE DO PONIEDZIALKU 14.07)</div>
        </div>
        </Card>


               <Card classes="inline-flex flex-col justify-around">
            <div>
                <span className="font-bold">Zamówienia</span>
                <p className="cardDate">Bieżący tydzień</p>
            </div>
               <MiniBar
  orders={thisWeekOrders}
  visits={thisWeekVisits}
  ordersColor="#5c6dff"
  visitsColor="#c8e6c9"
/>

        <div className="stats-col text-sm mt-5">
            <div className="flex items-center"><span className="circ circ-orders"></span>Zamówienia: { thisWeekOrders.reduce((sum, val) => sum + val, 0)} </div>
            <div className="flex items-center" style={{maxWidth: 393.16}}><span className="circ circ-appointments"></span>Umówienia formularze: {thisWeekVisits.reduce((sum, val) => sum + val, 0)} (Rzeczywista wartość - DANE W BAZIE DO PONIEDZIALKU 14.07)</div>
        </div>
        </Card>


       <MarketingReport classes="mt-10"/>

    </div>  
)}