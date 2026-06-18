import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Tree, Button, Space, Input, message, theme } from 'antd';
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import iusPtStore from '../../store/IusPtStore';
import AddOverRoleModal from './AddOverRoleModal';

const { useToken } = theme;

const RoleTable = observer(({ info }) => {
  const { token } = useToken();
  const { userRoles, fetchUserRoles, isLoading, error, deleteUserRole } = iusPtStore;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleKeys, setSelectedRoleKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [copyRoleIds, setCopyRoleIds] = useState([]);

  useEffect(() => {
    fetchUserRoles(info.tabNumber);
  }, [fetchUserRoles, info.tabNumber]);

  // Построение дерева (группы имеют строковые ключи, роли – числовые ID)
  const treeData = useMemo(() => {
    const groups = {};
    (userRoles || []).forEach(role => {
      const typename = role.IusSpravRole?.typename || 'Без типа';
      const type = role.IusSpravRole?.type || 'Без типа';
      const code = role.IusSpravRole?.code || '';
      const name = role.IusSpravRole?.name || '';
      const searchLower = searchQuery.toLowerCase();
      if (searchQuery && !(typename.toLowerCase().includes(searchLower) ||
          type.toLowerCase().includes(searchLower) ||
          code.toLowerCase().includes(searchLower) ||
          name.toLowerCase().includes(searchLower))) {
        return;
      }
      if (!groups[typename]) groups[typename] = {};
      if (!groups[typename][type]) groups[typename][type] = [];
      groups[typename][type].push(role);
    });
    return Object.entries(groups)
      .filter(([_, types]) => Object.keys(types).length > 0)
      .map(([typename, types]) => ({
        title: typename,
        key: `group-${typename}`,
        children: Object.entries(types)
          .filter(([_, roles]) => roles.length > 0)
          .map(([typeName, roles]) => ({
            title: typeName,
            key: `subgroup-${typename}-${typeName}`,
            children: roles.map(role => ({
              title: `${role.IusSpravRole.code} - ${role.IusSpravRole.name}`,
              key: role.IusSpravRole.id,
              isLeaf: true,
            })),
          })),
      }));
  }, [userRoles, searchQuery]);

  // Рекурсивный сбор всех листовых ключей под заданным узлом
  const getAllLeafKeysUnder = useCallback((targetKey, nodes) => {
    const leafIds = [];
    const findAndCollect = (nodeList) => {
      for (const node of nodeList) {
        if (node.key === targetKey) {
          const collect = (n) => {
            if (n.isLeaf) leafIds.push(n.key);
            else if (n.children) n.children.forEach(collect);
          };
          collect(node);
          return true;
        }
        if (node.children && findAndCollect(node.children)) return true;
      }
      return false;
    };
    findAndCollect(nodes);
    return leafIds;
  }, []);

  const handleCheck = (checkedKeysValue, { checked, node }) => {
    let newCheckedKeys = Array.isArray(checkedKeysValue) ? checkedKeysValue : checkedKeysValue.checked;

    if (!node.isLeaf) {
      const leafIds = getAllLeafKeysUnder(node.key, treeData);
      if (checked) {
        // Добавляем все ID ролей из группы/подгруппы
        newCheckedKeys = [...new Set([...newCheckedKeys, ...leafIds])];
      } else {
        // Удаляем все ID ролей группы/подгруппы
        newCheckedKeys = newCheckedKeys.filter(k => !leafIds.includes(k));
      }
    }
    setSelectedRoleKeys(newCheckedKeys);
  };

  const handleDelete = async () => {
    const ids = selectedRoleKeys.filter(key => typeof key === 'number');
    if (ids.length === 0) return;
    try {
      for (const id of ids) await deleteUserRole(info.tabNumber, id);
      await fetchUserRoles(info.tabNumber);
      setSelectedRoleKeys([]);
      message.success('Роли удалены');
    } catch (error) {
      console.error(error);
      message.error('Ошибка удаления');
    }
  };

  const handleCopy = () => {
    const numericIds = selectedRoleKeys.filter(key => typeof key === 'number');
    if (numericIds.length === 0) {
      message.warning('Выберите хотя бы одну роль');
      return;
    }
    setCopyRoleIds(numericIds);
    setShowModal(true);
  };

  if (isLoading) return <div style={{ color: token.colorText }}>Загрузка...</div>;
  if (error) return <div style={{ color: token.colorError }}>Ошибка: {error}</div>;

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<DeleteOutlined />}
          danger
          disabled={selectedRoleKeys.length === 0}
          onClick={handleDelete}
        >
          Удалить
        </Button>
        <Button
          icon={<CopyOutlined />}
          disabled={selectedRoleKeys.length === 0}
          onClick={handleCopy}
        >
          Создать по образцу
        </Button>
      </Space>

      <Input.Search
        placeholder="Поиск ролей..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      <Tree
        checkable
        checkStrictly
        treeData={treeData}
        checkedKeys={selectedRoleKeys}
        onCheck={handleCheck}
        style={{ background: token.colorBgContainer }}
      />

      <AddOverRoleModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        selectedRoles={copyRoleIds}
        sourceUser={info}
      />
    </div>
  );
});

export default RoleTable;