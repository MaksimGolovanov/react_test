import React from 'react';
import { useMouseCoordinates } from '../../hooks/useMouseCoordinates';
import { formatDMS } from '../../lib/coordsConverter';
import './CoordinatesDisplay.css';

const CoordinatesDisplay: React.FC = () => {
  const mouseLatLng = useMouseCoordinates();

  return (
    <div className="coordinates-display">
      {mouseLatLng ? formatDMS(mouseLatLng.lat, mouseLatLng.lng) : '—'}
    </div>
  );
};

export default CoordinatesDisplay;