import React, { useState, useEffect } from 'react'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const AvatarWithFallback = ({ 
  tabNumber, 
  size = 60, 
  className,
  icon = <UserOutlined />,
  fallbackSrc = null,
  timestamp // Добавляем пропс для таймстампа
}) => {
  const [errorCount, setErrorCount] = useState(0)
  
  const defaultFallback = `${process.env.REACT_APP_API_URL}static/photo/no.jpg`
  const customFallback = fallbackSrc || defaultFallback
  
  // Добавляем таймстамп к URL для обхода кэша
  const getAvatarSrc = () => {
    if (tabNumber) {
      return `${process.env.REACT_APP_API_URL}static/photo/${tabNumber}.jpg?t=${timestamp || Date.now()}`
    }
    return customFallback
  }

  const [src, setSrc] = useState(getAvatarSrc())

  // Обновляем src при изменении tabNumber или timestamp
  useEffect(() => {
    setSrc(getAvatarSrc())
    setErrorCount(0) // Сбрасываем счетчик ошибок
  }, [tabNumber, timestamp])

  const handleError = (e) => {
    //console.log('Avatar error occurred', e)
    
    try {
      const newErrorCount = errorCount + 1
      
      if (newErrorCount === 1) {
        setSrc(customFallback)
        setErrorCount(newErrorCount)
        
        if (e && typeof e === 'object' && e.target) {
          e.target.onerror = null
          e.target.src = customFallback
        }
      }
    } catch (error) {
      //console.warn('Error in avatar error handler:', error)
      setSrc(customFallback)
    }
  }

  return (
    <Avatar
      size={size}
      src={src}
      icon={icon}
      className={className}
      onError={handleError}
    />
  )
}

export default AvatarWithFallback