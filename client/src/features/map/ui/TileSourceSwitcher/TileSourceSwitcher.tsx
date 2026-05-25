// src/modules/Map/ui/TileSourceSwitcher/TileSourceSwitcher.tsx
import React from 'react';
import { Button, Tooltip } from 'antd';
import { MAP_ICONS } from '../../lib/constants';

interface MapSource {
  id: string;
  name: string;
}

interface TileSourceSwitcherProps {
  sources: MapSource[];        // список доступных карт с сервера
  currentSourceId: string;
  onSwitch: (sourceId: string) => void;
}

const TileSourceSwitcher: React.FC<TileSourceSwitcherProps> = ({ sources, currentSourceId, onSwitch }) => {
  if (!sources.length) return null;

  return (
    <div style={{ display: 'inline-flex', gap: 8, marginLeft: 16 }}>
      {sources.map(source => (
        
          <Button
            onClick={() => onSwitch(source.id)}
            type={currentSourceId === source.id ? 'primary' : 'default'}
            style={{ padding: '4px 8px' }}
          >
            <img
              src={MAP_ICONS[source.id] || '/icons/default.png'}
              alt={source.name}
              style={{ width: 20, height: 20, display: 'block' }}
            />
          </Button>
        
      ))}
    </div>
  );
};

export default TileSourceSwitcher;