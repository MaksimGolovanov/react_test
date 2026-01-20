// src/features/security-training/components/admin/UsersTable.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Table,
  Space,
  Typography,
  Progress,
  Tag,
  Button,
  Tooltip,
  Popconfirm,
  Badge,
  Input,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import AvatarWithFallback from '../../../../../Components/AvatarWithFallback/AvatarWithFallback';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import userStore from '../../../store/UserStore';
import CourseService from '../../../api/CourseService';

const { Text } = Typography;
const { Search } = Input;

const getRoleColor = (role) => {
  const colors = {
    ADMIN: 'red',
    'ST-ADMIN': 'volcano',
    ST: 'blue',
    USER: 'green',
  };
  return colors[role] || 'default';
};

const getProgressColor = (score) => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'normal';
  return 'exception';
};

const formatTimeFromMinutes = (minutes) => {
  if (!minutes || minutes === 0) return '0 мин';

  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours} ч`;
  }

  return `${hours} ч ${mins} мин`;
};

const SearchPanel = ({
  searchText,
  onSearchChange,
  totalUsers,
  filteredCount,
}) => (
  <Row style={{ marginBottom: 16 }}>
    <Col span={8}>
      <Search
        placeholder="Поиск по ФИО, логину или табельному номеру"
        allowClear
        enterButton={<SearchOutlined />}
        size="small"
        value={searchText}
        onChange={onSearchChange}
        onSearch={onSearchChange}
        style={{ width: '100%' }}
      />
    </Col>
    <Col span={16} style={{ textAlign: 'right', paddingTop: 4 }}>
      <Text type="secondary">
        Найдено: {filteredCount} из {totalUsers} пользователей
      </Text>
    </Col>
  </Row>
);

const UserCell = ({ user, getFioByTabNumber }) => {
  const fio = getFioByTabNumber(user.tabNumber);

  return (
    <Space>
      <AvatarWithFallback
        tabNumber={user.tabNumber}
        size={45}
        fallbackSrc={`${process.env.REACT_APP_API_URL}static/photo/no.jpg`}
        timestamp={Date.now()}
      />
      <div>
        {fio && (
          <Text
            strong
            style={{ fontSize: '14px', display: 'block', marginBottom: 2 }}
          >
            {fio}
          </Text>
        )}
        <Text style={{ fontSize: '13px', display: 'block', marginBottom: 2 }}>
          Логин: {user.login || 'Не указано'}
        </Text>
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Таб. №: {user.tabNumber}
          </Text>
        </div>
        {user.description && (
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {user.description}
            </Text>
          </div>
        )}
      </div>
    </Space>
  );
};

const calculateAverageTestScore = async (tabNumber) => {
  try {
    const coursesResponse = await CourseService.getCourses({ limit: 1000 });
    const allCourses = coursesResponse.courses || [];

    if (allCourses.length === 0) {
      return 0;
    }

    let totalScore = 0;
    let coursesWithValidScore = 0;

    for (const course of allCourses) {
      try {
        const progress = await CourseService.getUserProgress(
          tabNumber,
          course.id
        );

        if (progress && progress.passed_test === true) {
          if (
            progress.test_score !== undefined &&
            progress.test_score !== null
          ) {
            const score = parseFloat(progress.test_score);
            if (!isNaN(score)) {
              totalScore += score;
              coursesWithValidScore++;
            }
          }
        }
      } catch (error) {
        continue;
      }
    }

    const average =
      coursesWithValidScore > 0 ? totalScore / coursesWithValidScore : 0;
    return average;
  } catch (error) {
    console.error(
      `Error calculating average test score for ${tabNumber}:`,
      error
    );
    return 0;
  }
};

const StatsCell = ({ user, userStatistics, userAverageScores }) => {
  const stats = userStatistics?.[user.tabNumber];

  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <Spin size="small" />
      </div>
    );
  }

  const stStats = stats.st_stats || {};
  const completed_courses = stStats.completed_courses || stats.completed_courses || 0;
  const total_courses = stats.total_courses || 0;
  const averageScore = userAverageScores?.[user.tabNumber] || 0;
  const total_training_time = stStats.total_training_time || stats.total_time_spent || 0;

  const courseProgressPercentage =
    total_courses > 0
      ? Math.round((completed_courses / total_courses) * 100)
      : 0;

  return (
    <div>
      <Space direction="vertical" size={2} style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Курсы:
          </Text>
          <Space size={4}>
            <Badge
              count={completed_courses}
              style={{ backgroundColor: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: '11px' }}>
              из {total_courses}
            </Text>
          </Space>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Прогресс курсов:
          </Text>
          <Progress
            percent={courseProgressPercentage}
            size="small"
            strokeColor={getProgressColor(courseProgressPercentage)}
            style={{ width: 100 }}
            format={() => `${completed_courses}/${total_courses}`}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Средний балл:
          </Text>
          <Badge
            count={`${averageScore.toFixed(1)}%`}
            style={{
              backgroundColor:
                getProgressColor(averageScore) === 'success'
                  ? '#52c41a'
                  : getProgressColor(averageScore) === 'normal'
                  ? '#faad14'
                  : '#ff4d4f',
              fontSize: '11px',
            }}
          />
          <Text type="secondary" style={{ fontSize: '10px' }}>
            (по пройденным)
          </Text>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Время обучения:
          </Text>
          <Text style={{ fontSize: '12px' }}>
            {formatTimeFromMinutes(total_training_time)}
          </Text>
        </div>
      </Space>
    </div>
  );
};

const LastActivityCell = ({ user, userStatistics }) => {
  const stats = userStatistics?.[user.tabNumber];
  const lastActivity = stats?.last_accessed;

  if (!lastActivity) {
    return <Tag color="default">Нет данных</Tag>;
  }

  return (
    <div>
      <Text style={{ fontSize: '12px' }}>
        {moment(lastActivity).format('DD.MM.YYYY')}
      </Text>
      <div>
        <Text type="secondary" style={{ fontSize: '11px' }}>
          {moment(lastActivity).format('HH:mm')}
        </Text>
      </div>
      <div>
        <Text type="secondary" style={{ fontSize: '10px' }}>
          {moment(lastActivity).fromNow()}
        </Text>
      </div>
    </div>
  );
};

const ActionsCell = ({
  user,
  onViewUser,
  onEditUser,
  onDeleteUser,
  getFioByTabNumber,
}) => {
  const fio = getFioByTabNumber(user.tabNumber);
  const displayName = fio || user.login || 'пользователя';

  return (
    <Space>
      <Tooltip title="Просмотр">
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onViewUser(user)}
        />
      </Tooltip>
      <Tooltip title="Редактировать">
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEditUser(user)}
        />
      </Tooltip>
      <Tooltip title="Удалить">
        <Popconfirm
          title="Удалить пользователя?"
          description={`Вы уверены, что хотите удалить ${displayName}?`}
          onConfirm={() => onDeleteUser(user)}
          okText="Да"
          cancelText="Нет"
        >
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Tooltip>
    </Space>
  );
};

const UsersTable = observer(
  ({ users, loading, onEditUser, onDeleteUser, onViewUser }) => {
    const [searchText, setSearchText] = useState('');
    const [userStatistics, setUserStatistics] = useState({});
    const [userAverageScores, setUserAverageScores] = useState({});
    const [statsLoading, setStatsLoading] = useState(false);

    const fioCache = useMemo(() => {
      const cache = {};
      userStore.staff.forEach((staff) => {
        if (staff.tabNumber) {
          cache[staff.tabNumber] = staff.fio;
        }
      });
      return cache;
    }, [userStore.staff]);

    const getFioByTabNumber = useCallback(
      (tabNumber) => {
        if (!tabNumber) return null;
        return fioCache[tabNumber.toString()] || null;
      },
      [fioCache]
    );

    const calculateUserAverageScore = useCallback(async (tabNumber) => {
      try {
        return await calculateAverageTestScore(tabNumber);
      } catch (error) {
        console.error(`Error calculating average for ${tabNumber}:`, error);
        return 0;
      }
    }, []);

    useEffect(() => {
      const loadUserStatistics = async () => {
        if (users.length === 0) return;

        setStatsLoading(true);
        const stats = {};
        const averageScores = {};

        try {
          for (const user of users) {
            try {
              const tabNumber = user.tabNumber;
              if (!tabNumber) continue;

              const userStats = await CourseService.getUserStats(tabNumber);

              if (userStats) {
                const allCourses = await CourseService.getCourses({
                  limit: 1000,
                });
                let lastAccessed = null;

                for (const course of allCourses.courses || []) {
                  try {
                    const progress = await CourseService.getUserProgress(
                      tabNumber,
                      course.id
                    );

                    if (progress && progress.last_accessed) {
                      const accessedDate = new Date(progress.last_accessed);
                      if (
                        !lastAccessed ||
                        accessedDate > new Date(lastAccessed)
                      ) {
                        lastAccessed = progress.last_accessed;
                      }
                    }
                  } catch (error) {
                    continue;
                  }
                }

                stats[tabNumber] = {
                  ...userStats,
                  last_accessed: lastAccessed,
                };

                const averageScore = await calculateUserAverageScore(tabNumber);
                averageScores[tabNumber] = averageScore;
              }
            } catch (error) {
              console.error(
                `Error loading stats for user ${user.login}:`,
                error
              );
            }
          }
        } catch (error) {
          console.error('Error loading user statistics:', error);
        } finally {
          setUserStatistics(stats);
          setUserAverageScores(averageScores);
          setStatsLoading(false);
        }
      };

      loadUserStatistics();
    }, [users, calculateUserAverageScore]);

    const filteredUsers = useMemo(() => {
      if (!searchText.trim()) return users;

      const searchLower = searchText.toLowerCase().trim();

      return users.filter((user) => {
        const loginMatch = user.login?.toLowerCase().includes(searchLower);
        const tabNumberMatch = user.tabNumber?.toString().includes(searchLower);
        const fioMatch = getFioByTabNumber(user.tabNumber)
          ?.toLowerCase()
          .includes(searchLower);
        const descriptionMatch = user.description
          ?.toLowerCase()
          .includes(searchLower);

        return loginMatch || tabNumberMatch || fioMatch || descriptionMatch;
      });
    }, [users, searchText, getFioByTabNumber]);

    const handleSearchChange = useCallback((e) => {
      setSearchText(e.target?.value || e);
    }, []);

    const userColumns = useMemo(
      () => [
        {
          title: 'Пользователь',
          dataIndex: 'login',
          key: 'login',
          width: 250,
          render: (_, record) => (
            <UserCell user={record} getFioByTabNumber={getFioByTabNumber} />
          ),
          sorter: (a, b) => {
            const fioA = getFioByTabNumber(a.tabNumber) || a.login || '';
            const fioB = getFioByTabNumber(b.tabNumber) || b.login || '';
            return fioA.localeCompare(fioB);
          },
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Роли',
          dataIndex: 'roles',
          key: 'roles',
          width: 150,
          render: (roles) => (
            <Space wrap>
              {roles?.map((role, index) => (
                <Tag key={index} color={getRoleColor(role)}>
                  {role}
                </Tag>
              ))}
            </Space>
          ),
          filters: [
            { text: 'ADMIN', value: 'ADMIN' },
            { text: 'ST-ADMIN', value: 'ST-ADMIN' },
            { text: 'ST', value: 'ST' },
            { text: 'USER', value: 'USER' },
          ],
          onFilter: (value, record) => record.roles?.includes(value),
        },
        {
          title: 'Статистика обучения',
          key: 'stats',
          width: 250,
          render: (_, record) => (
            <StatsCell
              user={record}
              userStatistics={userStatistics}
              userAverageScores={userAverageScores}
            />
          ),
          sorter: (a, b) => {
            const averageA = userAverageScores[a.tabNumber] || 0;
            const averageB = userAverageScores[b.tabNumber] || 0;
            return averageA - averageB;
          },
        },
        {
          title: 'Последняя активность',
          key: 'lastActivity',
          width: 150,
          render: (_, record) => (
            <LastActivityCell user={record} userStatistics={userStatistics} />
          ),
          sorter: (a, b) => {
            const statsA = userStatistics[a.tabNumber];
            const statsB = userStatistics[b.tabNumber];

            const dateA = statsA?.last_accessed ? new Date(statsA.last_accessed) : new Date(0);
            const dateB = statsB?.last_accessed ? new Date(statsB.last_accessed) : new Date(0);

            return dateA - dateB;
          },
          defaultSortOrder: 'descend',
        },
        {
          title: 'Действия',
          key: 'actions',
          width: 150,
          fixed: 'right',
          render: (_, record) => (
            <ActionsCell
              user={record}
              onViewUser={onViewUser}
              onEditUser={onEditUser}
              onDeleteUser={onDeleteUser}
              getFioByTabNumber={getFioByTabNumber}
            />
          ),
        },
      ],
      [
        getFioByTabNumber,
        onViewUser,
        onEditUser,
        onDeleteUser,
        userStatistics,
        userAverageScores,
      ]
    );

    const overallLoading = loading || statsLoading;

    return (
      <div>
        <SearchPanel
          searchText={searchText}
          onSearchChange={handleSearchChange}
          totalUsers={users.length}
          filteredCount={filteredUsers.length}
        />

        <Table
          columns={userColumns}
          dataSource={filteredUsers}
          loading={overallLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} из ${total} пользователей`,
          }}
          rowKey={(record) => record.id || record.tabNumber}
          scroll={{ x: 1000 }}
          bordered
          locale={{
            emptyText: searchText ? 'Пользователи не найдены' : 'Нет данных',
          }}
        />
      </div>
    );
  }
);

export default UsersTable;