// src/features/security-training/pages/CategoriesPage.jsx
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Avatar,
  Tag,
  Spin,
  message,
} from 'antd';
import {
  SecurityScanOutlined,
  SafetyOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CourseService from '../api/CourseService'; // Импортируем ваш сервис

const { Title, Text } = Typography;

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseCounts, setCourseCounts] = useState({});

  // Список направлений обучения
  const initialCategories = [
    {
      id: 'security',
      title: 'Информационная безопасность',
      description:
        'Защита данных, кибербезопасность, шифрование и безопасность сетей',
      iconType: 'SecurityScanOutlined',
      color: '#1890ff',
      courseCount: 0,
      dbCategory: 'it',
      path: 'courses',
      available: true,
    },
    {
      id: 'labor',
      title: 'Охрана труда',
      description:
        'Безопасность на производстве, СИЗ, нормы и правила охраны труда',
      iconType: 'SafetyOutlined',
      color: '#52c41a',
      courseCount: 0,
      dbCategory: 'ot',
      path: 'under-development',
      available: true,
      developmentText: 'Раздел в разработке',
    },
    {
      id: 'fire',
      title: 'Пожарная безопасность',
      description: 'Противопожарные нормы, эвакуация, средства пожаротушения',
      iconType: 'FireOutlined',
      color: '#f5222d',
      courseCount: 0,
      dbCategory: 'pb',
      path: 'under-development',
      available: false,
      developmentText: 'Скоро будет доступно',
    },
    {
      id: 'medical',
      title: 'Первая помощь',
      description: 'Медицинская помощь, сердечно-лёгочная реанимация, травмы',
      iconType: 'MedicineBoxOutlined',
      color: '#eb2f96',
      courseCount: 0,
      dbCategory: 'med',
      path: 'under-development',
      available: false,
      developmentText: 'Планируется к запуску',
    },
  ];

  // Функция для склонения слова "курс"
  const getCourseWord = (count) => {
    if (count === 1) return 'курс';
    if (count >= 2 && count <= 4) return 'курса';
    return 'курсов';
  };

  // Загрузка количества курсов по категориям из API
  useEffect(() => {
    const loadCourseCounts = async () => {
      try {
        setLoading(true);

        console.log('Загрузка данных о курсах...');

        const categoryPromises = initialCategories.map(async (category) => {
          try {
            const response = await CourseService.getCourses({
              category: category.dbCategory,
              active: true,
            });

            if (response && response.courses) {
              return {
                category: category.dbCategory,
                count: response.courses.length,
                total: response.pagination?.total || response.courses.length,
              };
            }
            return { category: category.dbCategory, count: 0, total: 0 };
          } catch (error) {
            console.error(
              `Ошибка загрузки курсов для категории ${category.dbCategory}:`,
              error
            );
            return { category: category.dbCategory, count: 0, total: 0 };
          }
        });

        // Выполняем все запросы параллельно
        const results = await Promise.all(categoryPromises);

        // Преобразуем результаты в удобный формат
        const counts = {};
        results.forEach((result) => {
          counts[result.category] = result.total || result.count;
        });

        console.log('Полученные данные о курсах:', counts);
        setCourseCounts(counts);

        // Обновляем категории с актуальным количеством курсов
        const updatedCategories = initialCategories.map((category) => ({
          ...category,
          courseCount: counts[category.dbCategory] || 0,
        }));

        setCategories(updatedCategories);
      } catch (error) {
        console.error('Ошибка загрузки количества курсов:', error);
        message.error('Не удалось загрузить данные о курсах');

        // В случае ошибки используем начальные значения
        const errorCounts = { it: 0, ot: 0, pb: 0, med: 0 };
        setCourseCounts(errorCounts);
        setCategories(initialCategories);
      } finally {
        setLoading(false);
      }
    };

    loadCourseCounts();
  }, []);

  // Функция для получения иконки по типу
  const getIconByType = (iconType) => {
    switch (iconType) {
      case 'SecurityScanOutlined':
        return <SecurityScanOutlined />;
      case 'SafetyOutlined':
        return <SafetyOutlined />;
      case 'FireOutlined':
        return <FireOutlined />;
      case 'MedicineBoxOutlined':
        return <MedicineBoxOutlined />;
      default:
        return <SecurityScanOutlined />;
    }
  };

  const handleCategoryClick = (category) => {
    // Создаем безопасный для сериализации объект
    const safeCategory = {
      id: category.id,
      title: category.title,
      color: category.color,
      iconType: category.iconType,
      available: category.available,
      developmentText: category.developmentText,
      dbCategory: category.dbCategory,
    };

    console.log('Navigating to courses with category:', category.dbCategory);

    // Если категория доступна, переходим на страницу курсов
    if (category.available) {
      // Используем относительный путь
      navigate('courses', {
        // Без начального слеша!
        state: {
          category: safeCategory,
          filter: {
            category: category.dbCategory,
          },
        },
      });
    } else {
      // Если категория недоступна, переходим на страницу "в разработке"
      navigate(category.path, { state: { category: safeCategory } });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: '24px',
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <Spin size="large" tip="Загрузка направлений обучения..." />
      </div>
    );
  }

  // Вычисляем общее количество курсов
  const totalCourses = Object.values(courseCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={2}>Выберите направление обучения</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Пройдите курсы по различным направлениям для повышения квалификации
        </Text>
        {totalCourses > 0 && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">
              Всего доступно <strong>{totalCourses}</strong>{' '}
              {getCourseWord(totalCourses)}
            </Text>
          </div>
        )}
      </div>

      {/* Список направлений */}
      <Row gutter={[24, 24]}>
        {categories.map((category) => (
          <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
            <Card
              hoverable={category.available}
              onClick={() => handleCategoryClick(category)}
              style={{
                height: '100%',
                borderRadius: 12,
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s',
                cursor: category.available ? 'pointer' : 'not-allowed',
                opacity: category.available ? 1 : 0.7,
                position: 'relative',
                overflow: 'hidden',
              }}
              bodyStyle={{
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {/* Бейдж "В разработке" */}
              {!category.available && (
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1,
                  }}
                >
                  <Tag
                    icon={<ClockCircleOutlined />}
                    color="orange"
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      padding: '4px 8px',
                    }}
                  >
                    В разработке
                  </Tag>
                </div>
              )}

              {/* Иконка и заголовок */}
              <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <Avatar
                  size={64}
                  icon={getIconByType(category.iconType)}
                  style={{
                    backgroundColor: `${category.color}15`,
                    color: category.color,
                    marginBottom: 12,
                    opacity: category.available ? 1 : 0.6,
                  }}
                />
                <Title level={4} style={{ margin: 0 }}>
                  {category.title}
                </Title>
              </div>

              {/* Описание */}
              <Text
                type="secondary"
                style={{
                  flex: 1,
                  marginBottom: 16,
                  opacity: category.available ? 1 : 0.6,
                }}
              >
                {category.description}
              </Text>

              {/* Статистика */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <Space>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      opacity: category.available ? 1 : 0.6,
                    }}
                  >
                    {category.courseCount > 0 ? (
                      <>
                        <strong>{category.courseCount}</strong>{' '}
                        {getCourseWord(category.courseCount)}
                      </>
                    ) : (
                      'Нет доступных курсов'
                    )}
                  </Text>
                </Space>
                <Text
                  style={{
                    color: category.available ? category.color : '#bfbfbf',
                    fontWeight: 500,
                  }}
                >
                  {category.available ? 'Выбрать →' : 'Скоро...'}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoriesPage;
