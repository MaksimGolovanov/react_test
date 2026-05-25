import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const useMouseCoordinates = () => {
  const map = useMap();
  const [mouseLatLng, setMouseLatLng] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!map) return;

    const onMouseMove = (e: L.LeafletMouseEvent) => {
      setMouseLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    const onMouseOut = () => {
      setMouseLatLng(null);
    };

    map.on('mousemove', onMouseMove);
    map.on('mouseout', onMouseOut);

    return () => {
      map.off('mousemove', onMouseMove);
      map.off('mouseout', onMouseOut);
    };
  }, [map]);

  return mouseLatLng;
};