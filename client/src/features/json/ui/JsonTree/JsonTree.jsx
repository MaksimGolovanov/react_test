import React from 'react';
import { theme } from 'antd';
import HighlightedText from '../HighlightedText/HighlightedText';

const { useToken } = theme;

const JsonTree = ({ data, searchTerm, searchHighlights, depth = 0, path = '' }) => {
  const { token } = useToken();

  const styles = {
    jsonIndent: {
      marginLeft: depth * 20,
    },
    jsonItem: {
      display: 'block',
      margin: '2px 0',
    },
    jsonKey: {
      color: token.colorPrimaryText, // #c41d7f аналог в токенах? используем primary
      fontWeight: 500,
    },
    jsonString: {
      color: token.colorSuccess,
    },
    jsonNumber: {
      color: token.colorInfo,
    },
    jsonBoolean: {
      color: token.colorWarning,
    },
    jsonNull: {
      color: token.colorTextDisabled,
    },
    jsonBracket: {
      color: token.colorTextSecondary,
      fontWeight: 'bold',
    },
    jsonComma: {
      color: token.colorTextSecondary,
    },
  };

  if (data === null) {
    return <span style={styles.jsonNull}>null</span>;
  }

  switch (typeof data) {
    case 'boolean':
      return <span style={styles.jsonBoolean}>{data.toString()}</span>;
    case 'number':
      return <span style={styles.jsonNumber}>{data}</span>;
    case 'string':
      return (
        <span style={styles.jsonString}>
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
          return <span style={styles.jsonBracket}>[]</span>;
        }
        return (
          <div style={styles.jsonIndent}>
            <span style={styles.jsonBracket}>[</span>
            {data.map((item, index) => (
              <div key={index} style={styles.jsonItem}>
                <JsonTree
                  data={item}
                  searchTerm={searchTerm}
                  searchHighlights={searchHighlights}
                  depth={depth + 1}
                  path={`${path}[${index}]`}
                />
                {index < data.length - 1 && <span style={styles.jsonComma}>,</span>}
              </div>
            ))}
            <span style={styles.jsonBracket}>]</span>
          </div>
        );
      } else {
        const keys = Object.keys(data);
        if (keys.length === 0) {
          return <span style={styles.jsonBracket}>{'{'}</span>;
        }
        return (
          <div style={styles.jsonIndent}>
            <span style={styles.jsonBracket}>{'{'}</span>
            {keys.map((key, index) => (
              <div key={key} style={styles.jsonItem}>
                <span style={styles.jsonKey}>
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
                {index < keys.length - 1 && <span style={styles.jsonComma}>,</span>}
              </div>
            ))}
            <span style={styles.jsonBracket}>{'}'}</span>
          </div>
        );
      }
    default:
      return <span>{String(data)}</span>;
  }
};

export default JsonTree;