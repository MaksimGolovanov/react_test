import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Input, Button, Upload, Typography, Alert, Space } from 'antd';
import { SearchOutlined, UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import JsonTree from '../ui/JsonTree/JsonTree';
import SearchNavigation from '../ui/SearchNavigation/SearchNavigation';
import styles from './JsonViewer.module.css';

const { Text } = Typography;

const JsonViewer = () => {
  const [jsonData, setJsonData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [error, setError] = useState('');
  const searchHighlights = useRef({});
  const containerRef = useRef(null);

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
        if (el) el.classList.remove(styles.currentHighlight);
      });
      
      element.classList.add(styles.currentHighlight);
      
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
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
          <div className={styles.searchContainer}>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск в JSON..."
              prefix={<SearchOutlined />}
              className={styles.searchInput}
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
          className={styles.errorAlert}
        />
      )}

      <Card className={styles.jsonCard}>
        <div className={styles.jsonContainer} ref={containerRef}>
          {jsonData ? (
            <div className={styles.jsonTree}>
              <JsonTree 
                data={jsonData}
                searchTerm={searchTerm}
                searchHighlights={searchHighlights}
              />
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FileTextOutlined className={styles.emptyIcon} />
              <Text type="secondary" className={styles.emptyText}>
                Загрузите JSON файл для просмотра
              </Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JsonViewer;