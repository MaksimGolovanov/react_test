import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Alert, Spin, Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import KnowledgeStore from '../store/KnowledgeStore';
import styles from './KnowledgeBase.module.css';

import KnowledgeHeader from '../ui/KnowledgeHeader/KnowledgeHeader';
import KnowledgeTable from '../ui/KnowledgeTable/KnowledgeTable';
import KnowledgeCategoryTree from '../ui/KnowledgeCategoryTree/KnowledgeCategoryTree';

const { Content } = Layout;

const KnowledgeBase = observer(() => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'descending',
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const allTags = useMemo(() => {
    if (!KnowledgeStore.articles) return [];
    const tagsSet = new Set();
    KnowledgeStore.articles.forEach((article) => {
      article.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [KnowledgeStore.articles]);

  const filteredArticles = useMemo(() => {
    if (!KnowledgeStore.articles) return [];
    let filtered = KnowledgeStore.articles;
    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.category_id === selectedCategory
      );
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(term) ||
          article.content.toLowerCase().includes(term) ||
          (article.description &&
            article.description.toLowerCase().includes(term)) ||
          (article.tags &&
            article.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    }
    if (selectedTag) {
      filtered = filtered.filter((article) =>
        article.tags?.includes(selectedTag)
      );
    }
    return filtered;
  }, [searchTerm, KnowledgeStore.articles, selectedCategory, selectedTag]);

  const sortedArticles = useMemo(() => {
    if (!filteredArticles) return [];
    let sortableItems = [...filteredArticles];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key.includes('_at')) {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        }
        if (aValue < bValue)
          return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredArticles, sortConfig]);

  const handleRowClick = (article) => {
    navigate(`/knowledge/article/${article.id}`);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleAddNew = () => navigate('/knowledge/new');
  const handleEdit = (article) => navigate(`/knowledge/edit/${article.id}`);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedRowKeys([]);
    setSelectedRow(null);
  };

  if (KnowledgeStore.error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Ошибка загрузки данных"
          description={KnowledgeStore.error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (KnowledgeStore.isLoading && !KnowledgeStore.articles) {
    return (
      <div className={styles.spinnerContainer}>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          size="large"
        />
        <p>Загрузка базы знаний...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <KnowledgeHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
        selectedRow={selectedRow}
        onEdit={handleEdit}
        onDelete={() => {
          setSelectedRowKeys([]);
          setSelectedRow(null);
        }}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        allTags={allTags}
      />

      <div className={styles.contentLayout}>
        {/* Панель категорий слева */}
        <div className={styles.sider}>
          <KnowledgeCategoryTree
            categories={KnowledgeStore.categories || []}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </div>

        {/* Таблица справа */}
        <div className={styles.tableContent}>
          <div className={styles.tableCard}>
            <div className={styles.articleListScroll}>
              <KnowledgeTable
                data={sortedArticles}
                sortConfig={sortConfig}
                onSort={requestSort}
                selectedRowKeys={selectedRowKeys}
                onSelectionChange={(keys, rows) => {
                  setSelectedRowKeys(keys);
                  setSelectedRow(rows[0] || null);
                }}
                onRowClick={handleRowClick}
                loading={KnowledgeStore.isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default KnowledgeBase;