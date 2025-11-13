import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.css'

const IconBtn = ({ icon: Icon, text, path, onClick, disabled = false }) => {
     const navigate = useNavigate()
     const handleClick = () => {
          if (disabled) return // Если кнопка неактивна, ничего не делаем

          if (path) {
               navigate(path) // Переход на другую страницу, если передан path
          } else if (onClick) {
               onClick() // Вызов функции, если передан onClick
          }
     }

     return ( 
        <div className={styles.iconbtn}>
            <button 
                className={`${styles.configbtn} ${disabled ? styles.disabled : ''}`} 
                onClick={handleClick}
                disabled={disabled} // Отключаем кнопку, если disabled=true
            >
                {Icon && <Icon size={20} className={styles.iconbtn} />}
                {text}
            </button>
        </div>
    );


}

export default IconBtn
