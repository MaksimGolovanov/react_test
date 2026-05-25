// src/modules/Map/components/MarkersLayer.tsx
import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Marker as MarkerType } from '../types/map.types';

const createIcon = () => L.icon({
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [0, -32],
  shadowSize: [32, 32],
});

interface MarkersLayerProps {
  markers: MarkerType[];
  onMarkerClick: (marker: MarkerType) => void;
}

const MarkersLayer: React.FC<MarkersLayerProps> = ({ markers, onMarkerClick }) => {
  const icon = React.useMemo(() => createIcon(), []);

  return (
    <>
      {markers.map(marker => {
        if (!marker?.geojson?.coordinates) return null;
        const [lng, lat] = marker.geojson.coordinates;
        return (
          <Marker
            key={marker.id}
            position={[lat, lng]}
            icon={icon}
            eventHandlers={{ 
              click: (e) => {
                e.target.closeTooltip(); // закрываем всплывающую подсказку
                onMarkerClick(marker);
              } 
            }}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} sticky>
              <b>{marker.name}</b><br />
              {marker.description}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

export default React.memo(MarkersLayer);