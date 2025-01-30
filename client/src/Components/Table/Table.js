import React, { useState, useMemo } from 'react';
import styles from './style.module.css';

const Table = ({ data, columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Функция сортировки
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Отсортированные и отфильтрованные данные
  const sortedAndFilteredData = useMemo(() => {
    let filteredData = [...data];

    // Фильтрация
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Сортировка
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [data, searchTerm, sortConfig]);

  return (
    <div className={styles.tablecontainer}>
      <div className={styles.searchcontainer}>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchinput}
        />
      </div>
      
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => sortData(column.key)}
                className={`styles.tableheader ${
                  sortConfig.key === column.key ? sortConfig.direction : ''
                }`}
              >
                {column.label}
                {sortConfig.key === column.key && (
                  <span className={styles.sortindicator}>
                    {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredData.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{item[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {sortedAndFilteredData.length === 0 && (
        <div className={styles.nodata}>Нет данных для отображения</div>
      )}
    </div>
  );
};

export default Table;