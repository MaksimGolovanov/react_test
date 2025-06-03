import React, { useState, useEffect, useRef } from 'react';
import styles from './Circle.module.css';
const API_URL = process.env.REACT_APP_API_URL

const Circle = ({ fullName, size = 40, employeeId }) => {
  const [displayMode, setDisplayMode] = useState('initials'); // 'initials' | 'photo' | 'loading'
  const color = useRef(generatePastelColor()).current;
  const imgRef = useRef(null);

  useEffect(() => {
    if (!employeeId) {
      setDisplayMode('initials');
      return;
    }

    setDisplayMode('loading');
    
    // 1. Сначала пробуем через Image (самый надежный способ)
    const img = new Image();
    img.src = `${API_URL}static/photo/${employeeId}.jpg?t=${Date.now()}`;

    const onLoad = () => {
      if (img.width > 0) {
        setDisplayMode('photo');
      } else {
        setDisplayMode('initials');
      }
    };

    const onError = () => {
      setDisplayMode('initials');
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    // 2. Альтернативная проверка через fetch с таймаутом
    const timeoutId = setTimeout(() => {
      // Если Image не сработал за 500мс, пробуем fetch
      fetch(`${API_URL}static/photo/${employeeId}.jpg?t=${Date.now()}`, { method: 'HEAD' })
        .then(res => {
          if (res.ok && displayMode === 'loading') {
            setDisplayMode('photo');
          }
        })
        .catch(() => {
          if (displayMode === 'loading') {
            setDisplayMode('initials');
          }
        });
    }, 500);

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      clearTimeout(timeoutId);
    };
  }, [employeeId]);

  function generatePastelColor() {
    const r = Math.floor(Math.random() * 120 + 70);
    const g = Math.floor(Math.random() * 120 + 70);
    const b = Math.floor(Math.random() * 120 + 70);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function getInitials(name) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('');
  }

  const circleStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.4,
    fontWeight: 'bold',
    overflow: 'hidden',
    flexShrink: 0,
  };

  return (
    <div className={styles.circle} style={circleStyle}>
      {displayMode === 'loading' && (
        <div style={{ width: '100%', height: '100%' }} />
      )}
      
      {displayMode === 'photo' && (
        <img
          ref={imgRef}
          src={`${API_URL}static/photo/${employeeId}.jpg`}
          alt={fullName ? `${fullName}'s avatar` : 'User avatar'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={() => setDisplayMode('initials')}
          loading="eager" // Пробуем eager вместо lazy
        />
      )}
      
      {displayMode === 'initials' && getInitials(fullName)}
    </div>
  );
};

export default Circle;