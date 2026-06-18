import React from 'react';
import { theme } from 'antd';
import { useMouseCoordinates } from '../../hooks/useMouseCoordinates';
import { formatDMS } from '../../lib/coordsConverter';
import './CoordinatesDisplay.css';

const { useToken } = theme;

const CoordinatesDisplay: React.FC = () => {
  const { token } = useToken();
  const mouseLatLng = useMouseCoordinates();

  const displayStyle: React.CSSProperties = {
    background: `${token.colorBgElevated}cc`,
    backdropFilter: 'blur(4px)',
    color: token.colorText,
    boxShadow: token.boxShadow,
    border: `0.5px solid ${token.colorBorder}`,
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '11px',
    fontFamily: 'monospace',
    fontWeight: 500,
    width: '210px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    zIndex: 1000,
  };

  return (
    <div className="coordinates-display" style={displayStyle}>
      {mouseLatLng ? formatDMS(mouseLatLng.lat, mouseLatLng.lng) : '—'}
    </div>
  );
};

export default CoordinatesDisplay;