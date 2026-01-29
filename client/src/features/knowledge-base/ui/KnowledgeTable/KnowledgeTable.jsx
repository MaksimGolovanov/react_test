import React from 'react';
import { Table, Tag, Tooltip, Avatar, Badge, Skeleton } from 'antd';
import { 
    SortAscendingOutlined, SortDescendingOutlined,
    EyeOutlined, StarOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './KnowledgeTable.module.css';

const KnowledgeTable = ({ 
    data, 
    sortConfig, 
    onSort, 
    selectedRowKeys, 
    onSelectionChange,
    onRowClick,
    loading = false 
}) => {
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? (
            <SortAscendingOutlined style={{ marginLeft: 5 }} />
        ) : (
            <SortDescendingOutlined style={{ marginLeft: 5 }} />
        );
    };

    const renderStatus = (status) => {
        const statusConfig = {
            draft: { text: 'Черновик', color: 'orange' },
            published: { text: 'Опубликовано', color: 'green' },
            archived: { text: 'Архив', color: 'gray' }
        };
        
        const config = statusConfig[status] || { text: 'Неизвестно', color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const renderTags = (tags) => {
        if (!tags || tags.length === 0) {
            return <span style={{ color: '#8c8c8c', fontStyle: 'italic' }}>нет тегов</span>;
        }
        
        return (
            <div className={styles.tagsContainer}>
                {tags.slice(0, 2).map((tag, index) => (
                    <Tag key={index} size="small" color="blue">
                        {tag}
                    </Tag>
                ))}
                {tags.length > 2 && (
                    <Tooltip title={tags.slice(2).join(', ')}>
                        <Tag size="small">+{tags.length - 2}</Tag>
                    </Tooltip>
                )}
            </div>
        );
    };

    const renderContent = (content) => {
        const plainText = content?.replace(/<[^>]*>/g, '').substring(0, 100);
        return (
            <Tooltip title={plainText}>
                <span className={styles.contentPreview}>
                    {plainText || 'Нет содержания'}...
                </span>
            </Tooltip>
        );
    };

    const columns = [
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: renderStatus,
        },
        {
            title: (
                <span onClick={() => onSort('title')} style={{ cursor: 'pointer' }}>
                    Заголовок {getSortIcon('title')}
                </span>
            ),
            dataIndex: 'title',
            key: 'title',
            width: 250,
            render: (text, record) => (
                <div className={styles.titleCell}>
                    <div className={styles.titleRow}>
                        <span className={styles.titleText}>{text}</span>
                        {record.featured && (
                            <StarOutlined style={{ color: '#faad14', marginLeft: 8 }} />
                        )}
                    </div>
                    {record.category && (
                        <div className={styles.category}>
                            {record.category.name}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Автор',
            dataIndex: 'author',
            key: 'author',
            width: 150,
            render: (author) => (
                <div className={styles.authorCell}>
                    <Avatar size="small" style={{ marginRight: 8 }}>
                        {author?.charAt(0) || '?'}
                    </Avatar>
                    {author || 'Неизвестен'}
                </div>
            ),
        },
        {
            title: 'Теги',
            dataIndex: 'tags',
            key: 'tags',
            width: 200,
            render: renderTags,
        },
        {
            title: 'Содержание',
            dataIndex: 'content',
            key: 'content',
            render: renderContent,
        },
        {
            title: (
                <span onClick={() => onSort('views')} style={{ cursor: 'pointer' }}>
                    <EyeOutlined /> {getSortIcon('views')}
                </span>
            ),
            dataIndex: 'views',
            key: 'views',
            width: 80,
            align: 'center',
            render: (views) => (
                <Badge 
                    count={views || 0} 
                    style={{ backgroundColor: '#52c41a' }}
                    showZero 
                />
            ),
        },
        {
            title: (
                <span onClick={() => onSort('created_at')} style={{ cursor: 'pointer' }}>
                    Дата {getSortIcon('created_at')}
                </span>
            ),
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (date) => (
                <Tooltip title={format(new Date(date), 'PPpp', { locale: ru })}>
                    <div className={styles.dateCell}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {format(new Date(date), 'dd.MM.yy', { locale: ru })}
                    </div>
                </Tooltip>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectionChange,
        type: 'radio',
        columnWidth: 60,
    };

    if (loading) {
        return (
            <div className={styles.skeletonContainer}>
                {[...Array(5)].map((_, index) => (
                    <Skeleton active key={index} />
                ))}
            </div>
        );
    }

    return (
        <Table
            size="middle"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            className={styles.table}
            rowClassName={styles.tableRow}
            onRow={(record) => ({
                onClick: () => onRowClick && onRowClick(record), // Добавляем обработчик клика
            })}
        />
    );
};

export default KnowledgeTable;