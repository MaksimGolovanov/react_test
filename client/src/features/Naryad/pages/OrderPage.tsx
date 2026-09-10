// src/modules/Naryad/pages/OrderPage.tsx

import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Skeleton, theme, Drawer, Modal, Select } from 'antd';
import orderStore from '../store/OrderStore';
import styles from './style.module.css';
import OrderTable from '../ui/OrderTable/OrderTable';
import OrderHeader from '../ui/OrderHeader/OrderHeader';
import DocumentForm from '../ui/DocumentForm';


const { useToken } = theme;

const OrderPage: React.FC = observer(() => {
    const { token } = useToken();
    const [searchTerm, setSearchTerm] = useState('');
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [templateSelectionVisible, setTemplateSelectionVisible] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

    const { filteredOrders, currentPage, pageSize, isLoading, error, templates } = orderStore;

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredOrders.slice(start, start + pageSize);
    }, [filteredOrders, currentPage, pageSize]);

    const total = filteredOrders.length;

    const handleAddNew = () => {
        if (templates.length === 0) {
            alert('Нет доступных шаблонов');
            return;
        }
        // Если шаблонов несколько – показываем модальное окно выбора
        if (templates.length === 1) {
            orderStore.createDraft(templates[0].id);
            setDrawerVisible(true);
        } else {
            // Можно использовать Ant Design Modal с Select
            setTemplateSelectionVisible(true);
        }
    };

    const handleEdit = (order: any) => {
        orderStore.selectOrder(order);
        setDrawerVisible(true);
    };

    const handleCopy = (order: any) => {
        // Копируем данные, но создаём новый черновик с тем же шаблоном
        const newOrder = {
            ...order,
            id: 'tmp-' + Date.now().toString(),
            number: `НД-${new Date().getFullYear()}-${String(orderStore.orders.length + 1).padStart(3, '0')}`,
            data: { ...order.data },
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        orderStore.selectOrder(newOrder);
        setDrawerVisible(true);
    };

    const handleDelete = () => {
        // ... аналогично предыдущему
    };

    const handleCloseDrawer = () => {
        setDrawerVisible(false);
        orderStore.clearSelection();
    };

    if (error) {
        return (
            <div style={{ padding: 24 }}>
                <Alert message="Ошибка загрузки данных" description={error.message} type="error" showIcon />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div style={{ padding: 24 }}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <OrderHeader
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                    setSearchTerm(val);
                    orderStore.setSearchTerm(val);
                }}
                onAddNew={handleAddNew}
                selectedRow={selectedRow}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopy}
            />
            <div className={styles.tableCard} style={{ background: token.colorBgContainer, boxShadow: token.boxShadow }}>
                <div className={styles.userListScroll}>
                    <OrderTable
                        data={paginatedData}
                        selectedRowKeys={selectedRowKeys}
                        onSelectionChange={(keys, rows) => {
                            setSelectedRowKeys(keys);
                            setSelectedRow(rows[0] || null);
                        }}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onPaginationChange={(page, size) => {
                            orderStore.setCurrentPage(page);
                            orderStore.setPageSize(size);
                            setSelectedRowKeys([]);
                            setSelectedRow(null);
                        }}
                    />
                </div>
            </div>
            <Drawer
                title="Редактирование наряда-допуска"
                placement="right"
                open={drawerVisible}
                onClose={handleCloseDrawer}
                destroyOnClose
                width="90vw"
                styles={{ body: { padding: 0 } }}
            >
                <DocumentForm onSuccess={handleCloseDrawer} onCancel={handleCloseDrawer} />
            </Drawer>
            <Modal
                title="Выберите тип наряда"
                open={templateSelectionVisible}
                onOk={() => {
                    if (selectedTemplateId) {
                        orderStore.createDraft(selectedTemplateId);
                        setDrawerVisible(true);
                    }
                    setTemplateSelectionVisible(false);
                }}
                onCancel={() => setTemplateSelectionVisible(false)}
            >
                <Select
                    placeholder="Выберите шаблон"
                    style={{ width: '100%' }}
                    onChange={setSelectedTemplateId}
                >
                    {templates.map(t => (
                        <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
});

export default OrderPage;