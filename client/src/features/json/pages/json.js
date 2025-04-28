import React, { useState, useEffect, useRef } from 'react'
import styles from './style.module.css'

// Функция для безопасной сериализации с обработкой циклических ссылок
const safeStringify = (obj, space = 2) => {
  const seen = new WeakSet()
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]'
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

  useEffect(() => {
    if (jsonInput.trim() === '') {
      setJsonData(null)
      setError('')
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      // Проверка на циклические ссылки при парсинге
      safeStringify(parsed)
      setJsonData(parsed)
      setError('')
    } catch (err) {
      setError('Invalid JSON: ' + err.message)
      setJsonData(null)
    }
  }, [jsonInput])

  useEffect(() => {
    if (!searchTerm || !jsonData) {
      setSearchResults([])
      return
    }

    searchHighlights.current = {}
    const results = []
    const seen = new WeakSet()

    const searchInObject = (obj, path = '') => {
      if (seen.has(obj)) return
      seen.add(obj)

      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key

        if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            path: currentPath,
            type: 'key',
            value: key,
          })
        }

        const value = obj[key]
        if (value !== null && typeof value === 'object') {
          searchInObject(value, currentPath)
        } else {
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
      console.error('Search error:', error)
      setError('Error during search: Circular structure detected')
    }

    setSearchResults(results)
    setCurrentResultIndex(0)
  }, [searchTerm, jsonData, displayMode])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setJsonInput(e.target.result)
    }
    reader.readAsText(file)
  }

  const scrollToResult = (index) => {
    if (searchResults.length === 0) return

    const result = searchResults[index]
    const highlightId = `${result.path}-${result.type}`
    const element = searchHighlights.current[highlightId]

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })

      Object.values(searchHighlights.current).forEach((el) => {
        el.classList.remove(styles.currentHighlight)
      })
      element.classList.add(styles.currentHighlight)
    }
  }

  const handleNextResult = () => {
    if (searchResults.length === 0) return
    const nextIndex = (currentResultIndex + 1) % searchResults.length
    setCurrentResultIndex(nextIndex)
    scrollToResult(nextIndex)
  }

  const handlePrevResult = () => {
    if (searchResults.length === 0) return
    const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length
    setCurrentResultIndex(prevIndex)
    scrollToResult(prevIndex)
  }

  const registerHighlight = (path, type, element) => {
    if (element) {
      const highlightId = `${path}-${type}`
      searchHighlights.current[highlightId] = element
    }
  }

  const HighlightMatch = ({ text, searchTerm, path, type = 'value' }) => {
    if (!searchTerm || !text) return text

    const parts = text.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return (
      <span ref={(el) => registerHighlight(path, type, el)}>
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

  const renderJsonValue = (value, depth = 0, path = '', seen = new WeakSet()) => {
    if (seen.has(value)) {
      return <span className={styles.jsonError}>[Circular]</span>
    }
    seen.add(value)

    if (value === null) {
      return <span className={styles.jsonNull}>null</span>
    }
    if (typeof value === 'boolean') {
      return <span className={styles.jsonBoolean}>{value.toString()}</span>
    }
    if (typeof value === 'number') {
      return <span className={styles.jsonNumber}>{value}</span>
    }
    if (typeof value === 'string') {
      return (
        <span className={styles.jsonString}>
          "<HighlightMatch text={value} searchTerm={searchTerm} path={path} type="value" />"
        </span>
      )
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return <span>[]</span>
      return (
        <div style={{ marginLeft: `${depth * 15}px` }}>
          <span>[</span>
          {value.map((item, index) => {
            const newPath = `${path}[${index}]`
            return (
              <div key={index}>
                {renderJsonValue(item, depth + 1, newPath, seen)}
                {index < value.length - 1 && <span>,</span>}
              </div>
            )
          })}
          <span>]</span>
        </div>
      )
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value)
      if (keys.length === 0) return <span>{'{'}</span>
      return (
        <div style={{ marginLeft: `${depth * 15}px` }}>
          <span>{'{'}</span>
          {keys.map((key, index) => {
            const newPath = path ? `${path}.${key}` : key
            return (
              <div key={key}>
                <span className={styles.jsonKey}>
                  "<HighlightMatch text={key} searchTerm={searchTerm} path={newPath} type="key" />":
                </span>
                {renderJsonValue(value[key], depth + 1, newPath, seen)}
                {index < keys.length - 1 && <span>,</span>}
              </div>
            )
          })}
          <span>{'}'}</span>
        </div>
      )
    }
  }

  const renderRawJson = () => {
    try {
      const jsonString = safeStringify(jsonData, 2)
      return (
        <pre className={styles.jsonRaw} ref={jsonDisplayRef}>
          {jsonString.split('\n').map((line, i) => (
            <div key={i} className={styles.jsonLine}>
              <HighlightMatch text={line} searchTerm={searchTerm} path={`line-${i}`} type="value" />
            </div>
          ))}
        </pre>
      )
    } catch (error) {
      return <div className={styles.error}>Error displaying JSON: Circular structure detected</div>
    }
  }

  const renderTreeView = () => {
    return (
      <div className={styles.jsonTree} ref={jsonDisplayRef}>
        {renderJsonValue(jsonData)}
      </div>
    )
  }

  const renderTable = () => {
    try {
      if (!jsonData || typeof jsonData !== 'object' || Array.isArray(jsonData)) {
        return <div>Table view is only available for object JSON</div>
      }

      safeStringify(jsonData) // Проверка на циклические ссылки

      return (
        <table className={styles.jsonTable} ref={jsonDisplayRef}>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(jsonData).map(([key, value]) => {
              const path = key
              return (
                <tr key={key}>
                  <td>
                    <HighlightMatch text={key} searchTerm={searchTerm} path={path} type="key" />
                  </td>
                  <td>
                    <HighlightMatch
                      text={safeStringify(value, 2)}
                      searchTerm={searchTerm}
                      path={path}
                      type="value"
                    />
                  </td>
                  <td>{Array.isArray(value) ? 'array' : typeof value}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )
    } catch (error) {
      return <div className={styles.error}>Cannot display table view: Circular structure detected</div>
    }
  }

  return (
    <div className={`${styles.app} ${styles[theme]}`}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>
            Upload JSON file:
            <input type="file" accept=".json" onChange={handleFileUpload} />
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label>
            Display Mode:
            <select value={displayMode} onChange={(e) => setDisplayMode(e.target.value)}>
              <option value="tree">Tree View</option>
              <option value="raw">Raw JSON</option>
              <option value="table">Table View</option>
            </select>
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label>
            Theme:
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
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
            Show Input Panel
          </label>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search in JSON..."
          className={styles.searchInput}
        />
        {searchResults.length > 0 && (
          <div className={styles.searchNavigation}>
            <button onClick={handlePrevResult}>&lt; Prev</button>
            <span>
              {currentResultIndex + 1} / {searchResults.length}
            </span>
            <button onClick={handleNextResult}>Next &gt;</button>
          </div>
        )}
      </div>

      {showInputPanel && (
        <div className={styles.jsonInput}>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here or upload a file"
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