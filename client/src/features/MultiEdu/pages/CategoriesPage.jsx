// src/features/security-training/pages/CategoriesPage.jsx
import { Row, Col,  Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/categories/CategoryCard';
import { useCourseCounts } from '../components/categories/useCourseCounts';
import { INITIAL_CATEGORIES } from '../components/categories/constants/categories';
import './CategoriesPage.css';


const CategoriesPage = () => {
  const navigate = useNavigate();
  const { courseCounts, loading } = useCourseCounts(INITIAL_CATEGORIES);

  const handleCategoryClick = (category) => {
    const safeCategory = {
      id: category.id,
      title: category.title,
      color: category.color,
      iconType: category.iconType,
      available: category.available,
      dbCategory: category.dbCategory,
    };

    if (category.available) {
      navigate('courses', {
        state: {
          category: safeCategory,
          filter: { category: category.dbCategory },
        },
      });
    } else {
      navigate(category.path, { state: { category: safeCategory } });
    }
  };

  if (loading) {
    return (
      <div className="categories-container">
        <div style={styles.loadingContainer}>
          <Spin size="large" tip="Загрузка направлений обучения..." />
        </div>
      </div>
    );
  }

  const categories = INITIAL_CATEGORIES.map(category => ({
    ...category,
    courseCount: courseCounts[category.dbCategory] || 0,
  }));

  return (
    <div className="categories-container">
           
      <Row gutter={[24, 24]} className="categories-grid">
        {categories.map((category) => (
          <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
            <CategoryCard
              category={category}
              onClick={() => handleCategoryClick(category)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
  },
};

export default CategoriesPage;