import React from 'react';
import { theme } from 'antd';

const { useToken } = theme;

const HighlightedText = ({ text, searchTerm, path, type, searchHighlights }) => {
  const { token } = useToken();

  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  const highlightStyle = {
    backgroundColor: token.colorWarningBg,
    color: token.colorWarningText,
    padding: '0 2px',
    borderRadius: 2,
    transition: 'all 0.3s',
  };

  return (
    <span
      ref={(el) => {
        if (el && path && searchHighlights) {
          searchHighlights.current[`${path}-${type}`] = el;
        }
      }}
    >
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={i} style={highlightStyle}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default HighlightedText;