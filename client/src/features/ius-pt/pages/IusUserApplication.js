import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Checkbox,
  List,
  Card,
  Typography,
  Spin,
  message,
  theme,
} from 'antd';
import { ArrowLeftOutlined, FileExcelOutlined } from '@ant-design/icons';
import iusPtStore from '../store/IusPtStore';
import Circle from '../../../Components/circle/Circle';
import { generateIusApplicationExcel } from '../utils/exportIusApplication';

const { Title } = Typography;
const { useToken } = theme;

const IusUserApplication = observer(() => {
  const { token } = useToken();
  const { tabNumber } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [checkboxes, setCheckboxes] = useState({
    internet: false,
    ivs: false,
    evspd: true,
    newArmVariable: false,
    disableArm: false,
    conditionsChange: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await iusPtStore.fetchStaffWithIusUsers();
        await iusPtStore.fetchAdmins();
        const foundUser = iusPtStore.staffWithIusUsers.find(
          (s) => s.tabNumber === tabNumber
        );
        if (foundUser) setUser(foundUser);
        else setError('Пользователь не найден');
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке данных');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [tabNumber]);

  const handleCheckboxChange = (name, checked) => {
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const groupedRoles = () => {
    const roles = user?.IusUser?.IusSpravRoles || [];
    const groups = {};
    roles.forEach((role) => {
      const systemType = role.typename || 'Без системы';
      const type = role.type || 'Без типа';
      const createdAt = new Date(role.IusUserRoles.createdAt);
      const dateKey = createdAt.toISOString().split('T')[0];
      const displayDate = createdAt.toLocaleDateString('ru-RU');
      const groupKey = `${systemType}|${type}|${dateKey}`;
      if (!groups[groupKey]) {
        groups[groupKey] = {
          key: groupKey,
          systemType,
          type,
          roles: [],
          createdAt: createdAt.getTime(),
          date: displayDate,
        };
      }
      groups[groupKey].roles.push(role);
    });
    return Object.values(groups).sort((a, b) => b.createdAt - a.createdAt);
  };

  const getRoleWord = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'ролей';
    if (lastDigit === 1) return 'роль';
    if (lastDigit >= 2 && lastDigit <= 4) return 'роли';
    return 'ролей';
  };

  const handleExport = async () => {
    if (!selectedGroup) {
      message.warning('Выберите группу ролей');
      return;
    }
    try {
      await generateIusApplicationExcel(
        user,
        selectedGroup,
        checkboxes,
        iusPtStore.admins
      );
      message.success('Файл сформирован');
    } catch (err) {
      console.error(err);
      message.error('Ошибка при создании Excel');
    }
  };

  if (isLoading)
    return <div style={{ color: token.colorText }}>Загрузка...</div>;
  if (error) return <div style={{ color: token.colorError }}>{error}</div>;
  if (!user)
    return (
      <div style={{ color: token.colorTextSecondary }}>Данные не найдены</div>
    );

  return (
    <div style={{ padding: 16 }}>
      {/* Заголовок и кнопки */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ margin: 0, color: token.colorText }}>
          Заявки
        </Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/iuspt/user/${tabNumber}`)}
        >
          Назад
        </Button>
        {selectedGroup && (
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExport}
          >
            Выгрузка
          </Button>
        )}
      </div>

      {/* Карточка пользователя */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Circle fullName={user.fio} size={80} />
        <div>
          <div
            style={{ fontSize: 24, fontWeight: 500, color: token.colorText }}
          >
            {user.fio}
          </div>
          <div style={{ color: token.colorTextSecondary }}>
            {user.IusUser?.name || '-'}
          </div>
          <div>{user.department?.slice(13) || '-'}</div>
        </div>
      </div>

      {/* Две колонки */}
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Левая колонка – группы ролей */}
        <div
          style={{
            width: 400,
            borderRight: `1px solid ${token.colorBorder}`,
            paddingRight: 16,
          }}
        >
          <Title level={5}>Группы ролей</Title>
          <List
            dataSource={groupedRoles()}
            renderItem={(group) => (
              <List.Item
                onClick={() => setSelectedGroup(group)}
                style={{
                  cursor: 'pointer',
                  background:
                    selectedGroup?.key === group.key
                      ? token.colorPrimaryBg
                      : token.colorBgContainer,
                  border: `1px solid ${token.colorBorder}`,
                  marginBottom: 8,
                  borderRadius: 4,
                  padding: '8px 12px',
                }}
              >
                <List.Item.Meta
                  title={
                    <span style={{ color: token.colorText }}>
                      {group.systemType} - {group.type}
                    </span>
                  }
                  description={`${group.date} | ${group.roles.length} ${getRoleWord(group.roles.length)}`}
                />
              </List.Item>
            )}
          />
        </div>

        {/* Правая колонка – детали выбранной группы */}
        <div style={{ flex: 1 }}>
          {selectedGroup ? (
            <>
              <Card
                size="small"
                title="Детали ролей"
                style={{ marginBottom: 16 }}
              >
                <p>Система: {selectedGroup.systemType}</p>
                <p>Дата назначения: {selectedGroup.date}</p>
              </Card>

              <Card
                size="small"
                title="Дополнительные параметры"
                style={{ marginBottom: 16 }}
              >
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Checkbox
                    checked={checkboxes.newArmVariable}
                    onChange={(e) =>
                      handleCheckboxChange('newArmVariable', e.target.checked)
                    }
                  >
                    Подключение нового АРМ
                  </Checkbox>
                  <Checkbox
                    checked={checkboxes.disableArm}
                    onChange={(e) =>
                      handleCheckboxChange('disableArm', e.target.checked)
                    }
                  >
                    Отключение АРМ
                  </Checkbox>
                  <Checkbox
                    checked={checkboxes.conditionsChange}
                    onChange={(e) =>
                      handleCheckboxChange('conditionsChange', e.target.checked)
                    }
                  >
                    Изменение условий подключения
                  </Checkbox>
                  <Checkbox
                    checked={checkboxes.ivs}
                    onChange={(e) =>
                      handleCheckboxChange('ivs', e.target.checked)
                    }
                  >
                    ИВС
                  </Checkbox>
                  <Checkbox
                    checked={checkboxes.evspd}
                    onChange={(e) =>
                      handleCheckboxChange('evspd', e.target.checked)
                    }
                  >
                    ЕВСПД
                  </Checkbox>
                  <Checkbox
                    checked={checkboxes.internet}
                    onChange={(e) =>
                      handleCheckboxChange('internet', e.target.checked)
                    }
                  >
                    Интернет
                  </Checkbox>
                </div>
              </Card>

              <Card size="small" title="Список ролей">
                {selectedGroup.roles.map((role, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderBottom: `1px solid ${token.colorBorder}`,
                      padding: '8px 0',
                    }}
                  >
                    <strong>Мандант:</strong> {role.mandat || 'Не указан'}{' '}
                    <strong>Код:</strong> {role.code}
                    <br />
                    <strong>Название:</strong> {role.name}
                  </div>
                ))}
              </Card>
            </>
          ) : (
            <div
              style={{
                color: token.colorTextSecondary,
                textAlign: 'center',
                padding: 32,
              }}
            >
              Выберите группу слева для просмотра деталей
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default IusUserApplication;
