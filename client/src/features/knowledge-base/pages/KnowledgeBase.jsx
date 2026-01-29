import React, { useState, useMemo,  } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Spin, Card, Layout, Tabs,  } from 'antd';
import {
  LoadingOutlined,

} from '@ant-design/icons';
import KnowledgeStore from '../store/MockKnowledgeStore';
import styles from './KnowledgeBase.module.css';

import KnowledgeHeader from '../ui/KnowledgeHeader/KnowledgeHeader';
import KnowledgeTable from '../ui/KnowledgeTable/KnowledgeTable';
import KnowledgeModal from '../ui/KnowledgeModal/KnowledgeModal';
import KnowledgeViewer from '../ui/KnowledgeViewer/KnowledgeViewer';
import KnowledgeCategoryTree from '../ui/KnowledgeCategoryTree/KnowledgeCategoryTree';

const { Content, Sider } = Layout;

const KnowledgeBase = observer(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'descending',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  // Фильтрация статей
  const filteredArticles = useMemo(() => {
    if (!KnowledgeStore.articles) return [];

    let filtered = KnowledgeStore.articles;

    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.category_id === selectedCategory
      );
    }

    // Фильтр по поисковому запросу
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

    // Фильтр по табу
    switch (activeTab) {
      case 'draft':
        filtered = filtered.filter((article) => article.status === 'draft');
        break;
      case 'published':
        filtered = filtered.filter((article) => article.status === 'published');
        break;
      case 'archived':
        filtered = filtered.filter((article) => article.status === 'archived');
        break;
      case 'featured':
        filtered = filtered.filter((article) => article.featured);
        break;
    }

    return filtered;
  }, [searchTerm, KnowledgeStore.articles, selectedCategory, activeTab]);

  // Сортировка статей
  const sortedArticles = useMemo(() => {
    if (!filteredArticles) return [];

    let sortableItems = [...filteredArticles];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Для дат
        if (sortConfig.key.includes('_at') || sortConfig.key === 'updated_at') {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        }

        // Для числовых значений
        if (sortConfig.key === 'views' || sortConfig.key === 'rating') {
          aValue = aValue || 0;
          bValue = bValue || 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [filteredArticles, sortConfig]);

  const handleRowClick = (article) => {
    setCurrentArticle(article);
    setIsViewerVisible(true);

    // Находим индекс статьи в отсортированном списке
    const index = sortedArticles.findIndex((a) => a.id === article.id);
    setCurrentArticleIndex(index);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleAddNew = () => {
    setCurrentArticle(null);
    setIsModalVisible(true);
  };

  const handleEdit = (article) => {
    setCurrentArticle(article);
    setIsModalVisible(true);
  };

  const handleViewerClose = () => {
    setIsViewerVisible(false);
    setCurrentArticle(null);
  };
  const handleNextArticle = () => {
    if (currentArticleIndex < sortedArticles.length - 1) {
      const nextArticle = sortedArticles[currentArticleIndex + 1];
      setCurrentArticle(nextArticle);
      setCurrentArticleIndex(currentArticleIndex + 1);
    }
  };

  const handlePreviousArticle = () => {
    if (currentArticleIndex > 0) {
      const prevArticle = sortedArticles[currentArticleIndex - 1];
      setCurrentArticle(prevArticle);
      setCurrentArticleIndex(currentArticleIndex - 1);
    }
  };

  const handleEditFromViewer = (article) => {
    setIsViewerVisible(false);
    setCurrentArticle(article);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentArticle(null);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedRowKeys([]);
    setSelectedRow(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
        }}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          size="large"
        />
        <p style={{ marginTop: 16 }}>Загрузка базы знаний...</p>
      </div>
    );
  }

  return (
    <Layout className={styles.container}>
      <Content>
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
        />

        

        {/* Табы */}
        <Card className={styles.tabsCard}>
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <Tabs.TabPane tab="Все статьи" key="all" />
            <Tabs.TabPane tab="Избранные" key="published" />

          </Tabs>
        </Card>

        {/* Основной контент */}
        <Layout className={styles.contentLayout}>
          <Sider width={250} className={styles.sider}>
            <KnowledgeCategoryTree
              categories={KnowledgeStore.categories || []}
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </Sider>

          <Content className={styles.tableContent}>
            <Card className={styles.tableCard}>
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
            </Card>
          </Content>
        </Layout>
      </Content>

      <KnowledgeModal
        visible={isModalVisible}
        currentArticle={currentArticle}
        categories={KnowledgeStore.categories || []}
        onCancel={handleModalClose}
        onSuccess={() => {
          handleModalClose();
          setSelectedRowKeys([]);
          setSelectedRow(null);
        }}
      />
      <KnowledgeViewer
        article={currentArticle}
        visible={isViewerVisible}
        onClose={handleViewerClose}
        onEdit={handleEditFromViewer}
        onPrevious={handlePreviousArticle}
        onNext={handleNextArticle}
        hasPrevious={currentArticleIndex > 0}
        hasNext={currentArticleIndex < sortedArticles.length - 1}
      />
    </Layout>
  );
});

export default KnowledgeBase;
