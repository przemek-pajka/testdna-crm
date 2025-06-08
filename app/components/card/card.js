import styles from "./card.module.css"

export const Card = (props) => (
   <div className={`${styles.card} shadow-lg`} >
   {props.children}
   </div>
) 