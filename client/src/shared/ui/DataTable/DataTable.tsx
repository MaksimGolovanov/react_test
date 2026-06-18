// shared/ui/DataTable/DataTable.tsx
import React from 'react';
import { Table, Card, Spin, Empty, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';

export interface DataTableProps<T> {
    data: T[];
    loading?: boolean;
    columns: ColumnsType<T>;
    rowKey?: keyof T | ((record: T) => string);
    pagination?: false | TablePaginationConfig;
    total?: number;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    rowSelection?: {
        selectedRowKeys?: React.Key[];
        onChange?: (keys: React.Key[], rows: T[]) => void;
        type?: 'checkbox' | 'radio';
    };
    onRowClick?: (record: T) => void;
    bordered?: boolean;
    size?: 'small' | 'middle' | 'large';
    scroll?: { x?: number | string; y?: number | string };
    emptyText?: string;
    title?: string;
    extra?: React.ReactNode;
}

export function DataTable<T extends object = any>({
    data,
    loading = false,
    columns,
    rowKey,
    pagination,
    total,
    currentPage = 1,
    pageSize = 10,
    onPageChange,
    rowSelection,
    onRowClick,
    bordered = true,
    size = 'middle',
    scroll,
    emptyText = 'Нет данных',
    title,
    extra,
}: DataTableProps<T>) {
    // Формируем конфиг пагинации, если пагинация не отключена
    const paginationConfig: TablePaginationConfig | false =
        pagination !== false
            ? {
                current: currentPage,
                pageSize,
                total: total ?? data.length,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                showTotal: (total) => `Всего: ${total}`,
                onChange: onPageChange,
                ...(typeof pagination === 'object' ? pagination : {}),
            }
            : false;

    // Если rowKey не передан, пытаемся использовать 'id' (но может не быть)
    const resolvedRowKey = rowKey ?? ('id' as keyof T);

    const table = (
        <Table<T>
            dataSource={data}
            columns={columns}
            loading={loading}
            rowKey={resolvedRowKey}
            pagination={paginationConfig}
            rowSelection={rowSelection}
            onRow={
                onRowClick
                    ? (record) => ({ onClick: () => onRowClick(record), style: { cursor: 'pointer' } })
                    : undefined
            }
            bordered={bordered}
            size={size}
            scroll={scroll}
            locale={{ emptyText: <Empty description={emptyText} /> }}
        />
    );

    if (title) {
        return (
            <Card title={title} extra={extra} style={{ borderRadius: 8 }}>
                {table}
            </Card>
        );
    }
    if (extra) {
        return (
            <>
                <div style={{ marginBottom: 16, textAlign: 'right' }}>{extra}</div>
                {table}
            </>
        );
    }
    return table;
}