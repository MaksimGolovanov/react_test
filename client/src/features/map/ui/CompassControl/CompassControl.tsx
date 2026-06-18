// src/modules/Map/ui/CompassControl/CompassControl.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { Tooltip, theme } from 'antd';
import './CompassControl.css';

const { useToken } = theme;

const CompassControl: React.FC = () => {
  const { token } = useToken();
  const map = useMap();
  const [bearing, setBearing] = useState(0);
  const prevBearingRef = useRef(0);
  const smoothBearingRef = useRef(0);

  const getMapBearing = () => {
    if (typeof (map as any).getBearing === 'function') {
      return (map as any).getBearing();
    }
    return (map as any)._angle || 0;
  };

  const updateBearing = () => {
    const raw = getMapBearing();
    let newBearing = raw;
    let diff = newBearing - prevBearingRef.current;
    if (diff > 180) newBearing -= 360;
    else if (diff < -180) newBearing += 360;
    prevBearingRef.current = newBearing;
    smoothBearingRef.current = newBearing;
    setBearing(smoothBearingRef.current);
  };

  useEffect(() => {
    if (!map) return;
    updateBearing();
    map.on('rotate', updateBearing);
    map.on('move', updateBearing);
    map.on('moveend', updateBearing);
    const interval = setInterval(updateBearing, 200);
    return () => {
      map.off('rotate', updateBearing);
      map.off('move', updateBearing);
      map.off('moveend', updateBearing);
      clearInterval(interval);
    };
  }, [map]);

  const resetNorth = () => {
    if (typeof (map as any).setBearing === 'function') {
      (map as any).setBearing(0);
      prevBearingRef.current = 0;
      smoothBearingRef.current = 0;
      setBearing(0);
    }
  };

  const ringStyle: React.CSSProperties = {
    background: `${token.colorBgElevated}cc`,
    backdropFilter: 'blur(8px)',
    boxShadow: token.boxShadow,
    border: `1px solid ${token.colorBorder}`,
  };

  const textStyle: React.CSSProperties = {
    color: token.colorText,
    textShadow: '0 1px 1px black',
  };

  return (
    <Tooltip title="Сбросить на север" placement="top">
      <div className="compass-modern" onClick={resetNorth}>
        <div className="compass-outer-ring" style={{ ...ringStyle, transform: `rotate(${bearing}deg)` }}>
          <div className="compass-ring-marks">
            <span className="mark-n" style={textStyle}>N</span>
            <span className="mark-e" style={textStyle}>E</span>
            <span className="mark-s" style={textStyle}>S</span>
            <span className="mark-w" style={textStyle}>W</span>
            <div className="mark-ne"></div>
            <div className="mark-se"></div>
            <div className="mark-sw"></div>
            <div className="mark-nw"></div>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default CompassControl;