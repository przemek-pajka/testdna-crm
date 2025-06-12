import styles from "./card.module.css"

export const Card = ({ children, classes = "" }) => (
   <div className={`${styles.card} ${classes} shadow-lg`} >
   {children}
   </div>
) 