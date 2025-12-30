import React from 'react';
import styles from '../../pages/JsonViewer.module.css';

const HighlightedText = ({ text, searchTerm, path, type, searchHighlights }) => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

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
          <mark key={i} className={styles.searchHighlight}>
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