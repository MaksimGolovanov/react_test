import React from 'react';
import { Table, Tag, Tooltip, Avatar, Skeleton, theme } from 'antd';
import { 
    SortAscendingOutlined, SortDescendingOutlined,
    ClockCircleOutlined 
} from '@ant-design/icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './KnowledgeTable.module.css';

const { useToken } = theme;

const KnowledgeTable = ({ 
    data, 
    sortConfig, 
    onSort, 
    selectedRowKeys, 
    onSelectionChange,
    onRowClick,
    loading = false 
}) => {
    const { token } = useToken();

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? (
            <SortAscendingOutlined style={{ marginLeft: 5 }} />
        ) : (
            <SortDescendingOutlined style={{ marginLeft: 5 }} />
        );
    };

    const renderTags = (tags) => {
        if (!tags || tags.length === 0) {
            return <span style={{ color: token.colorTextDisabled, fontStyle: 'italic' }}>нет тегов</span>;
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
                <span className={styles.contentPreview} style={{ color: token.colorTextSecondary }}>
                    {plainText || 'Нет содержания'}...
                </span>
            </Tooltip>
        );
    };

    const columns = [
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
                        <span className={styles.titleText} style={{ color: token.colorText }}>{text}</span>
                    </div>
                    {record.category && (
                        <div className={styles.category} style={{ color: token.colorTextSecondary }}>
                            {record.category.name}
                        </div>
                    )}
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
                <span onClick={() => onSort('created_at')} style={{ cursor: 'pointer' }}>
                    Дата {getSortIcon('created_at')}
                </span>
            ),
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (date) => (
                <Tooltip title={format(new Date(date), 'PPpp', { locale: ru })}>
                    <div className={styles.dateCell} style={{ color: token.colorTextSecondary }}>
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
                onClick: () => onRowClick && onRowClick(record),
            })}
        />
    );
};

export default KnowledgeTable;