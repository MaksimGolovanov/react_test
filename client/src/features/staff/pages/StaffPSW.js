import React, { useState, useCallback } from 'react'
import styles from './style.module.css'
import ButtonAll from '../../ius-pt/components/ButtonAll/ButtonAll'
import { useNavigate } from 'react-router-dom' // Импорт useNavigate

import { IoArrowBack } from 'react-icons/io5'

const PasswordGenerator = () => {
     const [password, setPassword] = useState('')
     const [strength, setStrength] = useState('')
     const [passwordLength, setPasswordLength] = useState(15)
     const navigate = useNavigate() // Использование useNavigate

     // Запрещенные комбинации соседних клавиш (QWERTY раскладка)
     const forbiddenSequences = [
          'qwerty',
          'asdfgh',
          'zxcvbn',
          '123456',
          'йцукен',
          'password',
          'admin',
          'qazwsx',
          '123qwe',
          '1qaz2wsx',
          'qwe123',
          'abc123',
          'passw0rd',
          'welcome',
          'login',
     ]

     // Словарные слова для проверки
     const dictionaryWords = [
          'admin',
          'password',
          'qwerty',
          '123456',
          'letmein',
          'monkey',
          'dragon',
          'master',
          'hello',
          'freedom',
          'whatever',
          'computer',
          'internet',
          'sunshine',
     ]

     // Генерация легко запоминающихся паттернов
     const generateMemorablePattern = () => {
          const patterns = [
               // Паттерн: Слово + Символы + Числа
               () => {
                    const words = ['Star', 'Moon', 'Sky', 'Sea', 'Wind', 'Fire', 'Snow']
                    const symbols = ['!', '>', '#', '%', '*', '/']
                    const word = words[Math.floor(Math.random() * words.length)]
                    const symbol1 = symbols[Math.floor(Math.random() * symbols.length)]
                    const symbol2 = symbols[Math.floor(Math.random() * symbols.length)]
                    const numbers = Math.floor(100 + Math.random() * 900)
                    return `${word}${symbol1}${numbers}${symbol2}`
               },

               // Паттерн: Чередование групп
               () => {
                    const groups = ['Abc', 'Xyz', 'Mno', 'Pqr', 'Stu', '123', '456', '789', '012', '345']
                    const symbols = ['!', '>', '#', '%', '*', '/']
                    const group1 = groups[Math.floor(Math.random() * groups.length)]
                    const group2 = groups[Math.floor(Math.random() * groups.length)]
                    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
                    return `${group1}${symbol}${group2}`
               },

               // Паттерн: Симметричный
               () => {
                    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'
                    const numbers = '23456789'
                    const symbols = ['!', '>', '#', '%', '*', '/']

                    let result = ''
                    // Первая часть: 2 буквы + 1 число
                    for (let i = 0; i < 2; i++) {
                         result += letters[Math.floor(Math.random() * letters.length)]
                    }
                    result += numbers[Math.floor(Math.random() * numbers.length)]

                    // Символ в середине
                    result += symbols[Math.floor(Math.random() * symbols.length)]

                    // Вторая часть (симметричная): 1 число + 2 буквы
                    result += numbers[Math.floor(Math.random() * numbers.length)]
                    for (let i = 0; i < 2; i++) {
                         result += letters[Math.floor(Math.random() * letters.length)]
                    }

                    return result
               },
          ]

          return patterns[Math.floor(Math.random() * patterns.length)]()
     }

     // Проверка на запрещенные последовательности
     const hasForbiddenSequence = (pwd) => {
          const lowerPwd = pwd.toLowerCase()

          // Проверка соседних клавиш
          for (const seq of forbiddenSequences) {
               if (lowerPwd.includes(seq)) return true
          }

          // Проверка словарных слов
          for (const word of dictionaryWords) {
               if (lowerPwd.includes(word.toLowerCase())) return true
          }

          // Проверка последовательных символов
          for (let i = 0; i < pwd.length - 2; i++) {
               const char1 = pwd.charCodeAt(i)
               const char2 = pwd.charCodeAt(i + 1)
               const char3 = pwd.charCodeAt(i + 2)

               // Проверка последовательных символов на клавиатуре
               if (Math.abs(char1 - char2) === 1 && Math.abs(char2 - char3) === 1) {
                    return true
               }
          }

          return false
     }

     // Проверка сложности пароля
     const checkPasswordStrength = (pwd) => {
          let score = 0

          if (pwd.length >= 15) score += 2
          if (/[A-Z]/.test(pwd)) score += 1
          if (/[a-z]/.test(pwd)) score += 1
          if (/[0-9]/.test(pwd)) score += 1
          if (/[!>#%*\/]/.test(pwd)) score += 2
          if (pwd.length >= 20) score += 1

          if (score >= 6) return { level: 'strong', color: '#4CAF50' }
          if (score >= 4) return { level: 'medium', color: '#FF9800' }
          return { level: 'weak', color: '#F44336' }
     }

     const generatePassword = useCallback(() => {
          let newPassword = ''
          let attempts = 0
          const maxAttempts = 100

          while (attempts < maxAttempts) {
               // Генерируем паттерны пока не достигнем нужной длины
               newPassword = ''
               while (newPassword.length < passwordLength) {
                    newPassword += generateMemorablePattern()
               }

               // Обрезаем до выбранной длины
               newPassword = newPassword.substring(0, passwordLength)

               // Проверяем требования
               if (
                    newPassword.length >= passwordLength &&
                    /[A-Z]/.test(newPassword) &&
                    /[a-z]/.test(newPassword) &&
                    /[0-9]/.test(newPassword) &&
                    /[!>#%*\/]/.test(newPassword) &&
                    !hasForbiddenSequence(newPassword)
               ) {
                    break
               }

               attempts++
               newPassword = ''
          }

          if (newPassword) {
               setPassword(newPassword)
               setStrength(checkPasswordStrength(newPassword))
          } else {
               setPassword('Не удалось сгенерировать пароль. Попробуйте еще раз.')
               setStrength({ level: 'error', color: '#F44336' })
          }
     }, [passwordLength])

     const copyToClipboard = async () => {
          try {
               await navigator.clipboard.writeText(password)
               alert('Пароль скопирован в буфер обмена!')
          } catch (err) {
               console.error('Ошибка копирования: ', err)
          }
     }

     const handleLengthChange = (event) => {
          const length = parseInt(event.target.value)
          if (length >= 15 && length <= 50) {
               setPasswordLength(length)
          }
     }

     return (
          <>
               <ButtonAll icon={IoArrowBack} text="Назад" onClick={() => navigate('/staff')} />

               <div className={styles.passwordGenerator}>
                    <h1 className={styles.title}>Генератор безопасных паролей</h1>

                    <div className={styles.controls}>
                         <div className={styles.lengthControl}>
                              <label htmlFor="passwordLength" className={styles.label}>
                                   Длина пароля: {passwordLength} символов
                              </label>
                              <input
                                   id="passwordLength"
                                   type="range"
                                   min="15"
                                   max="50"
                                   value={passwordLength}
                                   onChange={handleLengthChange}
                                   className={styles.slider}
                              />
                              <div className={styles.lengthValues}>
                                   <span>15</span>
                                   <span>50</span>
                              </div>
                         </div>
                    </div>

                    <div className={styles.passwordDisplay}>
                         <div className={styles.passwordField}>
                              <input
                                   type="text"
                                   value={password}
                                   readOnly
                                   placeholder="Нажмите 'Сгенерировать' для создания пароля"
                                   className={styles.passwordInput}
                              />
                              {password && !password.includes('Не удалось') && (
                                   <button onClick={copyToClipboard} className={styles.copyBtn}>
                                        📋
                                   </button>
                              )}
                         </div>

                         {strength && (
                              <div className={styles.strengthIndicator} style={{ backgroundColor: strength.color }}>
                                   Сложность:{' '}
                                   {strength.level === 'strong'
                                        ? 'Высокая'
                                        : strength.level === 'medium'
                                        ? 'Средняя'
                                        : strength.level === 'weak'
                                        ? 'Слабая'
                                        : 'Ошибка'}
                              </div>
                         )}
                    </div>

                    <ButtonAll
                         text="Сгенерировать пароль"
                         onClick={generatePassword}
                         className={styles.generateBtn}
                    ></ButtonAll>

                    <div className={styles.requirements}>
                         <h3>Требования к паролю:</h3>
                         <ul>
                              <li>✓ Длина не менее 15 символов</li>
                              <li>✓ Содержит A-Z, a-z, 0-9, специальные символы (!,#,%,*,/)</li>
                              <li>✓ Без имен, адресов, дат рождения, телефонов</li>
                              <li>✓ Без комбинаций соседних клавиш</li>
                              <li>✓ Без словарных слов</li>
                              <li>✓ Легко запоминается</li>
                         </ul>
                    </div>
               </div>
          </>
     )
}

export default PasswordGenerator
