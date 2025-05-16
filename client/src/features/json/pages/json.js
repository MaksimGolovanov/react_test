import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'

// Безопасная сериализация JSON с обработкой циклических ссылок
const safeStringify = (obj, space = 2) => {
  const seen = new WeakSet() // WeakSet для отслеживания объектов
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]' // Обнаружена циклическая ссылка
        seen.add(value)
      }
      return value
    },
    space
  )
}

function App() {
  const [jsonInput, setJsonInput] = useState('')
  const [jsonData, setJsonData] = useState(null)
  const [error, setError] = useState('')
  const [displayMode, setDisplayMode] = useState('tree')
  const [theme, setTheme] = useState('light')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [currentResultIndex, setCurrentResultIndex] = useState(0)
  const [showInputPanel, setShowInputPanel] = useState(false)

  const jsonDisplayRef = useRef(null)
  const searchHighlights = useRef({})

  // Обработка изменений JSON-ввода
  useEffect(() => {
    if (jsonInput.trim() === '') {
      setJsonData(null)
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      // Проверка на циклические ссылки
      safeStringify(parsed)
      setJsonData(parsed)
      setError('')
    } catch (err) {
      setError('Ошибка JSON: ' + err.message)
      setJsonData(null)
    }
  }, [jsonInput])

  // Поиск по JSON-данным
  useEffect(() => {
    if (!searchTerm || !jsonData) {
      setSearchResults([])
      return
    }

    searchHighlights.current = {}
    const results = []
    const seen = new WeakSet() // Для отслеживания обработанных объектов

    const searchInObject = (obj, path = '') => {
      // Пропускаем примитивы и null
      if (obj === null || typeof obj !== 'object') return
      if (seen.has(obj)) return
      seen.add(obj)

      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key

        // Поиск по ключам
        if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            path: currentPath,
            type: 'key',
            value: key,
          })
        }

        const value = obj[key]
        // Рекурсивный поиск во вложенных объектах
        if (value !== null && typeof value === 'object') {
          searchInObject(value, currentPath)
        } else {
          // Поиск по значениям (примитивам)
          const stringValue = String(value)
          if (stringValue.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              path: currentPath,
              type: 'value',
              value: stringValue,
            })
          }
        }
      }
    }

    try {
      if (Array.isArray(jsonData)) {
        jsonData.forEach((item, index) => {
          const currentPath = `[${index}]`
          if (typeof item === 'object' && item !== null) {
            searchInObject(item, currentPath)
          }
        })
      } else {
        searchInObject(jsonData)
      }
    } catch (error) {
      console.error('Ошибка поиска:', error)
      setError('Ошибка при поиске: обнаружена циклическая структура')
    }

    setSearchResults(results)
    setCurrentResultIndex(0)
  }, [searchTerm, jsonData, displayMode])

  // Загрузка JSON из файла
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setJsonInput(e.target.result)
    }
    reader.onerror = () => {
      setError('Ошибка чтения файла')
    }
    reader.readAsText(file)
  }

  // Компонент для подсветки совпадений при поиске
  const HighlightMatch = ({ text, searchTerm, path, type = 'value' }) => {
    if (!searchTerm || !text) return text

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return (
      <span ref={(el) => {
        if (el) searchHighlights.current[`${path}-${type}`] = el
      }}>
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
    )
  }

  // Рендер значения JSON с учетом типа
  const renderJsonValue = (value, depth = 0, path = '', seen = new WeakSet()) => {
    // Обработка циклических ссылок (только для объектов)
    if (value !== null && typeof value === 'object') {
      if (seen.has(value)) {
        return <span className={styles.jsonError}>[Circular]</span>
      }
      seen.add(value)
    }

    switch (true) {
      case value === null:
        return <span className={styles.jsonNull}>null</span>
      case typeof value === 'boolean':
        return <span className={styles.jsonBoolean}>{value.toString()}</span>
      case typeof value === 'number':
        return <span className={styles.jsonNumber}>{value}</span>
      case typeof value === 'string':
        return (
          <span className={styles.jsonString}>
            "<HighlightMatch text={value} searchTerm={searchTerm} path={path} type="value" />"
          </span>
        )
      case Array.isArray(value):
        if (value.length === 0) return <span>[]</span>
        return (
          <div style={{ marginLeft: `${depth * 15}px` }}>
            <span>[</span>
            {value.map((item, index) => (
              <div key={index}>
                {renderJsonValue(item, depth + 1, `${path}[${index}]`, seen)}
                {index < value.length - 1 && <span>,</span>}
              </div>
            ))}
            <span>]</span>
          </div>
        )
      case typeof value === 'object':
        const keys = Object.keys(value)
        if (keys.length === 0) return <span>{'{'}</span>
        return (
          <div style={{ marginLeft: `${depth * 15}px` }}>
            <span>{'{'}</span>
            {keys.map((key, index) => (
              <div key={key}>
                <span className={styles.jsonKey}>
                  "<HighlightMatch text={key} searchTerm={searchTerm} path={`${path}.${key}`} type="key" />":
                </span>
                {renderJsonValue(value[key], depth + 1, `${path}.${key}`, seen)}
                {index < keys.length - 1 && <span>,</span>}
              </div>
            ))}
            <span>{'}'}</span>
          </div>
        )
      default:
        return <span>{String(value)}</span>
    }
  }

  // Отображение JSON в разных режимах
  const renderTreeView = () => (
    <div className={styles.jsonTree} ref={jsonDisplayRef}>
      {renderJsonValue(jsonData)}
    </div>
  )

  const renderRawJson = () => (
    <pre className={styles.jsonRaw} ref={jsonDisplayRef}>
      {safeStringify(jsonData, 2)
        .split('\n')
        .map((line, i) => (
          <div key={i} className={styles.jsonLine}>
            <HighlightMatch text={line} searchTerm={searchTerm} path={`line-${i}`} type="value" />
          </div>
        ))}
    </pre>
  )

  const renderTable = () => {
    if (!jsonData || typeof jsonData !== 'object' || Array.isArray(jsonData)) {
      return <div>Табличный вид доступен только для объектов</div>
    }

    return (
      <table className={styles.jsonTable} ref={jsonDisplayRef}>
        <thead>
          <tr>
            <th>Ключ</th>
            <th>Значение</th>
            <th>Тип</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(jsonData).map(([key, value]) => (
            <tr key={key}>
              <td><HighlightMatch text={key} searchTerm={searchTerm} path={key} type="key" /></td>
              <td><HighlightMatch text={safeStringify(value)} searchTerm={searchTerm} path={key} type="value" /></td>
              <td>{Array.isArray(value) ? 'массив' : typeof value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  // Навигация по результатам поиска
  const navigateSearchResults = (direction) => {
    if (searchResults.length === 0) return
    const newIndex = direction === 'next'
      ? (currentResultIndex + 1) % searchResults.length
      : (currentResultIndex - 1 + searchResults.length) % searchResults.length
    setCurrentResultIndex(newIndex)
    scrollToHighlight(newIndex)
  }

  // Прокрутка к найденному результату
  const scrollToHighlight = (index) => {
    const result = searchResults[index]
    const element = searchHighlights.current[`${result.path}-${result.type}`]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Подсветка текущего результата
      Object.values(searchHighlights.current).forEach(el => 
        el.classList.remove(styles.currentHighlight)
      )
      element.classList.add(styles.currentHighlight)
    }
  }

  return (
    <div className={`${styles.app} ${styles[theme]}`}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>
            Загрузить JSON:
            <input type="file" accept=".json" onChange={handleFileUpload} />
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label>
            Режим отображения:
            <select value={displayMode} onChange={(e) => setDisplayMode(e.target.value)}>
              <option value="tree">Дерево</option>
              <option value="raw">Исходный JSON</option>
              <option value="table">Таблица</option>
            </select>
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label>
            Тема:
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
            </select>
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label>
            <input
              type="checkbox"
              checked={showInputPanel}
              onChange={(e) => setShowInputPanel(e.target.checked)}
            />
            Показать поле ввода
          </label>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск в JSON..."
          className={styles.searchInput}
        />
        {searchResults.length > 0 && (
          <div className={styles.searchNavigation}>
            <button onClick={() => navigateSearchResults('prev')}>&lt; Назад</button>
            <span>
              {currentResultIndex + 1} / {searchResults.length}
            </span>
            <button onClick={() => navigateSearchResults('next')}>Вперед &gt;</button>
          </div>
        )}
      </div>

      {showInputPanel && (
        <div className={styles.jsonInput}>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Вставьте JSON или загрузите файл"
            rows={10}
          />
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.jsonDisplayContainer}>
        <div className={styles.jsonDisplay}>
          {jsonData && displayMode === 'tree' && renderTreeView()}
          {jsonData && displayMode === 'raw' && renderRawJson()}
          {jsonData && displayMode === 'table' && renderTable()}
        </div>
      </div>
    </div>
  )
}

export default App