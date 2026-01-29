import React, { useState, useMemo } from 'react';
import { Tree, Input, Button, Empty, Spin } from 'antd';
import { SearchOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import styles from './KnowledgeCategoryTree.module.css';

const { Search } = Input;

const KnowledgeCategoryTree = ({ categories, selectedCategory, onSelect, loading = false }) => {
    const [searchValue, setSearchValue] = useState('');
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    // Преобразование категорий в структуру дерева
    const treeData = useMemo(() => {
        if (!categories) return [];

        const buildTree = (items, parentId = null) => {
            return items
                .filter(item => item.parent_id === parentId)
                .map(item => ({
                    title: item.name,
                    key: item.id.toString(),
                    icon: expandedKeys.includes(item.id.toString()) ? 
                        <FolderOpenOutlined /> : <FolderOutlined />,
                    children: buildTree(items, item.id),
                    data: item
                }));
        };

        return buildTree(categories);
    }, [categories, expandedKeys]);

    // Поиск по дереву
    const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        
        if (!value) {
            setExpandedKeys([]);
            return;
        }

        const expandKeys = treeData
            .map(item => {
                if (item.title.toLowerCase().includes(value.toLowerCase())) {
                    return getParentKey(item.key, treeData) || item.key;
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);

        setExpandedKeys(expandKeys);
        setAutoExpandParent(true);
    };

    const handleExpand = (keys) => {
        setExpandedKeys(keys);
        setAutoExpandParent(false);
    };

    const handleSelect = (selectedKeys, { node }) => {
        if (selectedKeys.length > 0) {
            onSelect(node.data.id);
        } else {
            onSelect(null);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="small" />
                <span>Загрузка категорий...</span>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Нет категорий"
                />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.searchBox}>
                <Search
                    placeholder="Поиск категорий..."
                    allowClear
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ marginBottom: 8 }}
                />
            </div>

            <div className={styles.treeContainer}>
                <Tree
                    showIcon
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onExpand={handleExpand}
                    treeData={treeData}
                    selectedKeys={selectedCategory ? [selectedCategory.toString()] : []}
                    onSelect={handleSelect}
                    className={styles.tree}
                />
            </div>

            <div className={styles.footer}>
                <Button 
                    type="link" 
                    size="small" 
                    onClick={() => onSelect(null)}
                    disabled={!selectedCategory}
                >
                    Сбросить фильтр
                </Button>
            </div>
        </div>
    );
};

export default KnowledgeCategoryTree;