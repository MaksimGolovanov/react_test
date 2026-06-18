import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Input, Button, Upload, Typography, Alert, Space, theme } from 'antd';
import { SearchOutlined, UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import JsonTree from '../ui/JsonTree/JsonTree';
import SearchNavigation from '../ui/SearchNavigation/SearchNavigation';

const { useToken } = theme;
const { Text } = Typography;

const JsonViewer = () => {
  const { token } = useToken();
  const [jsonData, setJsonData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [error, setError] = useState('');
  const searchHighlights = useRef({});
  const containerRef = useRef(null);

  // Динамические стили для скроллбара на основе токенов
  useEffect(() => {
    const styleId = 'json-scrollbar-styles';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      .json-scroll-container {
        scrollbar-width: thin;
        scrollbar-color: ${token.colorBorder} ${token.colorBgContainerDisabled};
      }
      .json-scroll-container::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }
      .json-scroll-container::-webkit-scrollbar-track {
        background: ${token.colorBgContainerDisabled};
        border-radius: 6px;
        margin: 4px;
      }
      .json-scroll-container::-webkit-scrollbar-thumb {
        background: ${token.colorBorder};
        border-radius: 6px;
        border: 3px solid ${token.colorBgContainerDisabled};
        min-height: 40px;
      }
      .json-scroll-container::-webkit-scrollbar-thumb:hover {
        background: ${token.colorTextSecondary};
      }
      .json-scroll-container::-webkit-scrollbar-thumb:active {
        background: ${token.colorText};
      }
      .json-scroll-container::-webkit-scrollbar-corner {
        background: ${token.colorBgContainerDisabled};
      }
    `;
    return () => {
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, [token]);

  // Загрузка JSON файла
  const handleFileUpload = useCallback((file) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('Файл слишком большой. Максимальный размер: 10MB');
      return false;
    }

    setError('');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        setJsonData(parsed);
      } catch (err) {
        setError('Ошибка парсинга JSON: ' + err.message);
        setJsonData(null);
      }
    };

    reader.onerror = () => {
      setError('Ошибка чтения файла');
    };

    reader.readAsText(file);
    return false;
  }, []);

  // Поиск в JSON
  const performSearch = useCallback(() => {
    if (!searchTerm || !jsonData) {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }

    const results = [];
    const seen = new WeakSet();
    let count = 0;
    const MAX_RESULTS = 1000;

    const searchInObject = (obj, path = '') => {
      if (count >= MAX_RESULTS) return;
      if (!obj || typeof obj !== 'object') return;
      if (seen.has(obj)) return;
      seen.add(obj);

      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (count >= MAX_RESULTS) return;
          const currentPath = path ? `${path}[${index}]` : `[${index}]`;

          if (typeof item === 'object' && item !== null) {
            searchInObject(item, currentPath);
          } else {
            const stringValue = String(item);
            if (stringValue.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({
                path: currentPath,
                type: 'value',
                value: stringValue,
                elementId: `${currentPath}-value`
              });
              count++;
            }
          }
        });
      } else {
        Object.keys(obj).forEach((key) => {
          if (count >= MAX_RESULTS) return;

          const currentPath = path ? `${path}.${key}` : key;
          const value = obj[key];

          // Поиск по ключам
          if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              path: currentPath,
              type: 'key',
              value: key,
              elementId: `${currentPath}-key`
            });
            count++;
          }

          // Рекурсивный поиск по значениям
          if (value !== null && typeof value === 'object') {
            if (currentPath.split('.').length < 10) {
              searchInObject(value, currentPath);
            }
          } else {
            const stringValue = String(value);
            if (stringValue.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({
                path: currentPath,
                type: 'value',
                value: stringValue,
                elementId: `${currentPath}-value`
              });
              count++;
            }
          }
        });
      }
    };

    try {
      searchInObject(jsonData);
      setSearchResults(results);
      setCurrentResultIndex(results.length > 0 ? 0 : 0);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      setSearchResults([]);
    }
  }, [jsonData, searchTerm]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Навигация по результатам поиска
  const navigateToResult = useCallback((index) => {
    if (searchResults.length === 0) return;

    const result = searchResults[index];
    const element = searchHighlights.current[result.elementId];

    if (element && containerRef.current) {
      // Подсветка текущего результата
      Object.values(searchHighlights.current).forEach(el => {
        if (el) el.classList.remove('current-highlight');
      });

      element.classList.add('current-highlight');

      // Прокрутка к элементу
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [searchResults]);

  useEffect(() => {
    if (searchResults.length > 0) {
      navigateToResult(currentResultIndex);
    }
  }, [currentResultIndex, searchResults.length, navigateToResult]);

  const navigateResults = useCallback((direction) => {
    if (searchResults.length === 0) return;

    const newIndex = direction === 'next'
      ? (currentResultIndex + 1) % searchResults.length
      : (currentResultIndex - 1 + searchResults.length) % searchResults.length;

    setCurrentResultIndex(newIndex);
  }, [searchResults, currentResultIndex]);

  const containerStyles = {
    height: 'calc(100vh - 60px)',
    display: 'flex',
    flexDirection: 'column',
    
    padding: 16,
    overflow: 'hidden',
  };

  const headerStyles = {
    backgroundColor: token.colorBgContainer,
    padding: 16,
    borderRadius: token.borderRadius,
    marginBottom: 16,
    boxShadow: token.boxShadowTertiary,
    flexShrink: 0,
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const searchContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 300,
  };

  const searchInputStyles = {
    flex: 1,
  };

  const errorAlertStyles = {
    marginBottom: 16,
  };

  const jsonCardStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    boxShadow: token.boxShadow,
    minHeight: 0,
    overflow: 'hidden',
    padding: 0,
  };

  const jsonContainerStyles = {
    flex: 1,
    overflow: 'auto',
    padding: 16,
    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
    fontSize: 14,
    lineHeight: 1.5,
    backgroundColor: token.colorBgContainer,
    minHeight: 200,
  };

  const emptyStateStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: token.colorTextDisabled,
  };

  const emptyIconStyles = {
    fontSize: 48,
    color: token.colorTextDisabled,
    marginBottom: 16,
  };

  const emptyTextStyles = {
    marginTop: 16,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <Upload
          accept=".json"
          beforeUpload={handleFileUpload}
          showUploadList={false}
        >
          <Button type="primary" icon={<UploadOutlined />}>
            Загрузить JSON файл
          </Button>
        </Upload>

        {jsonData && (
          <div style={searchContainerStyles}>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск в JSON..."
              prefix={<SearchOutlined />}
              style={searchInputStyles}
            />
            {searchResults.length > 0 && (
              <SearchNavigation
                currentIndex={currentResultIndex}
                totalResults={searchResults.length}
                onPrev={() => navigateResults('prev')}
                onNext={() => navigateResults('next')}
              />
            )}
          </div>
        )}
      </div>

      {error && (
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          showIcon
          style={errorAlertStyles}
        />
      )}

      <div style={jsonCardStyles}>
        <div
          ref={containerRef}
          className="json-scroll-container"
          style={jsonContainerStyles}
        >
          {jsonData ? (
            <div>
              <JsonTree
                data={jsonData}
                searchTerm={searchTerm}
                searchHighlights={searchHighlights}
              />
            </div>
          ) : (
            <div style={emptyStateStyles}>
              <FileTextOutlined style={emptyIconStyles} />
              <Text type="secondary" style={emptyTextStyles}>
                Загрузите JSON файл для просмотра
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Глобальный стиль для подсветки поиска */}
      <style>
        {`
          .current-highlight {
            background-color: ${token.colorWarningBgHover} !important;
            box-shadow: 0 0 0 2px ${token.colorWarningBorder};
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 ${token.colorWarningBorder}; }
            70% { box-shadow: 0 0 0 4px rgba(0, 0, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default JsonViewer;