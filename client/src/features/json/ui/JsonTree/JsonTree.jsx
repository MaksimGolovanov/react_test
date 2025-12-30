import React from 'react';
import HighlightedText from '../HighlightedText/HighlightedText';
import styles from '../../pages/JsonViewer.module.css';

const JsonTree = ({ data, searchTerm, searchHighlights, depth = 0, path = '' }) => {
  if (data === null) {
    return <span className={styles.jsonNull}>null</span>;
  }

  switch (typeof data) {
    case 'boolean':
      return <span className={styles.jsonBoolean}>{data.toString()}</span>;
    case 'number':
      return <span className={styles.jsonNumber}>{data}</span>;
    case 'string':
      return (
        <span className={styles.jsonString}>
          "
          <HighlightedText 
            text={data}
            searchTerm={searchTerm}
            path={path}
            type="value"
            searchHighlights={searchHighlights}
          />
          "
        </span>
      );
    case 'object':
      if (Array.isArray(data)) {
        if (data.length === 0) {
          return <span className={styles.jsonBracket}>[]</span>;
        }
        return (
          <div className={styles.jsonIndent} style={{ marginLeft: `${depth * 20}px` }}>
            <span className={styles.jsonBracket}>[</span>
            {data.map((item, index) => (
              <div key={index} className={styles.jsonItem}>
                <JsonTree 
                  data={item}
                  searchTerm={searchTerm}
                  searchHighlights={searchHighlights}
                  depth={depth + 1}
                  path={`${path}[${index}]`}
                />
                {index < data.length - 1 && <span className={styles.jsonComma}>,</span>}
              </div>
            ))}
            <span className={styles.jsonBracket}>]</span>
          </div>
        );
      } else {
        const keys = Object.keys(data);
        if (keys.length === 0) {
          return <span className={styles.jsonBracket}>{'{'}</span>;
        }
        return (
          <div className={styles.jsonIndent} style={{ marginLeft: `${depth * 20}px` }}>
            <span className={styles.jsonBracket}>{'{'}</span>
            {keys.map((key, index) => (
              <div key={key} className={styles.jsonItem}>
                <span className={styles.jsonKey}>
                  "
                  <HighlightedText 
                    text={key}
                    searchTerm={searchTerm}
                    path={`${path}.${key}`}
                    type="key"
                    searchHighlights={searchHighlights}
                  />
                  "
                </span>
                :{' '}
                <JsonTree 
                  data={data[key]}
                  searchTerm={searchTerm}
                  searchHighlights={searchHighlights}
                  depth={depth + 1}
                  path={`${path}.${key}`}
                />
                {index < keys.length - 1 && <span className={styles.jsonComma}>,</span>}
              </div>
            ))}
            <span className={styles.jsonBracket}>{'}'}</span>
          </div>
        );
      }
    default:
      return <span>{String(data)}</span>;
  }
};

export default JsonTree;