import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Space, Row, Col, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const NoteSearchBar = ({ onSearch, onFilter, totalResults }) => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [dateRange, setDateRange] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({
      query: searchText,
      filterType,
      sortBy,
      dateRange
    });
  };

  const handleClear = () => {
    setSearchText('');
    setFilterType('all');
    setSortBy('date');
    setDateRange(null);
    onSearch({ query: '', filterType: 'all', sortBy: 'date', dateRange: null });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Input.Search
            placeholder="Поиск по заголовку и содержимому..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
          />
        </Col>
        <Col xs={24} md={8}>
          <Space style={{ width: '100%' }}>
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setShowFilters(!showFilters)}
              style={{ width: '50%' }}
            >
              Фильтры
            </Button>
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleClear}
              style={{ width: '50%' }}
            >
              Сбросить
            </Button>
          </Space>
        </Col>
      </Row>

      {showFilters && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Тип заметок"
              value={filterType}
              onChange={setFilterType}
            >
              <Option value="all">Все заметки</Option>
              <Option value="favorite">Избранное</Option>
              <Option value="archived">Архив</Option>
              <Option value="regular">Обычные</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Сортировка"
              value={sortBy}
              onChange={setSortBy}
            >
              <Option value="date">По дате (новые)</Option>
              <Option value="date_old">По дате (старые)</Option>
              <Option value="title">По заголовку</Option>
              <Option value="popular">По популярности</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Дата от', 'Дата до']}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>
        </Row>
      )}
      
      {totalResults !== undefined && (
        <div style={{ marginTop: 8, color: '#666' }}>
          Найдено заметок: <Badge count={totalResults} showZero style={{ backgroundColor: '#52c41a' }} />
        </div>
      )}
    </div>
  );
};

export default NoteSearchBar;