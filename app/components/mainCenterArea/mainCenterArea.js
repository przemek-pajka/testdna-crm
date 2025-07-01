"use client";


import { useEffect, useState } from "react";

const { UserNavigationBar } = require("../userNavigationBar/userNavigationBar")
import MiniBar from "../miniBar/miniBar"
import { Card } from "../card/card"
import styles from "./mainCenterArea.module.css"
import MarketingReport from "../marketingReport/marketingReport";

const EMPTY = Array(7).fill(0);

export const MainCenterArea = () => {
    const [lastWeek, setLastWeek] = useState(EMPTY);
    const [thisWeek, setThisWeek] = useState(EMPTY);    // ← jeśli będziesz też pokazywał bieżący tydzień

    useEffect(() => {
    (async () => {
      try {
        const resLast = await fetch("/api/wizyty/last7", { cache: "no-store" });
        const resThis = await fetch("/api/wizyty/this7", { cache: "no-store" });

        if (!resLast.ok || !resThis.ok) throw new Error("Błąd API");

        const last = await resLast.json();
        const current = await resThis.json();

        setLastWeek(last);
        setThisWeek(current);

      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  
return(
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
            <div className="flex items-center"><span className="circ circ-orders"></span>Zamówienia: 125 (Przykładowe)</div>
            <div className="flex items-center" style={{maxWidth: 393.16}}><span className="circ circ-appointments"></span>Umówienia formularze: {lastWeek.reduce((sum, val) => sum + val, 0)} (Rzeczywista wartość - DANE W BAZIE DO PONIEDZIALKU 30.06)</div>
        </div>
        </Card>


               <Card classes="inline-flex flex-col justify-around">
            <div>
                <span className="font-bold">Zamówienia</span>
                <p className="cardDate">Bieżący tydzień</p>
            </div>
                 <MiniBar data={thisWeek} barColor="#5c6dff"   // fiolet
  bgColor="#c8e6c9"    />

        <div className="stats-col text-sm mt-5">
            <div className="flex items-center"><span className="circ circ-orders"></span>Zamówienia: 153 (Przykładowe)</div>
            <div className="flex items-center" style={{maxWidth: 393.16}}><span className="circ circ-appointments"></span>Umówienia formularze: {thisWeek.reduce((sum, val) => sum + val, 0)} (Rzeczywista wartość - DANE W BAZIE DO PONIEDZIALKU 30.06)</div>
        </div>
        </Card>


       <MarketingReport classes="mt-10"/>

    </div>  
)}