// src/features/security-training/components/categories/CategoryCard.jsx
import { Card, Typography, Tag, Avatar } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { getIconByType } from './utils/iconUtils';
import { getCourseWord } from './utils/stringUtils';
import '../../pages/CategoriesPage.css';
const { Text } = Typography;

const CategoryCard = ({ category, onClick }) => {
  const IconComponent = getIconByType(category.iconType);
  const cardClassName = `category-card ${category.available ? 'available' : 'disabled'}`;

  return (
    <Card
      className={cardClassName}
      hoverable={category.available}
      onClick={onClick}
      style={{ '--card-color': category.color }}
    >
      {/* Бейдж "В разработке" */}
      {!category.available && (
        <div className="ribbon-badge">
          <Tag
            icon={<ClockCircleOutlined />}
            color="orange"
            style={{
              fontWeight: 'bold',
              fontSize: '12px',
              padding: '4px 8px',
              backgroundColor: '#fff9e6',
              borderColor: '#ffd666',
              color: '#d46b08',
            }}
          >
            В разработке
          </Tag>
        </div>
      )}

      {/* Иконка с анимацией */}
      <div className="card-icon-wrapper">
        <div 
          className="icon-background" 
          style={{ backgroundColor: category.color }}
        />
        <Avatar
          size={64}
          icon={IconComponent}
          className="category-icon"
          style={{
            backgroundColor: category.iconBgColor,
            color: category.color,
            border: `2px solid ${category.color}40`,
          }}
        />
      </div>

      {/* Контент карточки */}
      <div className="card-content">
        <h4 
          className="card-title"
          style={{ color: category.color }}
        >
          {category.title}
        </h4>

        {/* Теги */}
        <div className="tags-container">
          <Tag 
            className="category-tag" 
            style={{ 
              backgroundColor: `${category.color}15`, 
              color: category.color 
            }}
          >
            {category.courseCount > 0 
              ? `${category.courseCount} ${getCourseWord(category.courseCount)}`
              : 'Нет курсов'
            }
          </Tag>
        </div>

        {/* Описание */}
        <Text className="card-description">
          {category.description}
        </Text>
      </div>

      {/* Футер карточки */}
      <div className="card-footer">
        <div className="course-count">
          {category.courseCount > 0 ? (
            <span style={{ color: category.color, fontWeight: 500 }}>
              {category.courseCount} {getCourseWord(category.courseCount)}
            </span>
          ) : (
            <span style={{ color: '#8c8c8c' }}>Нет доступных курсов</span>
          )}
        </div>
        
        <Text 
          style={{ 
            color: category.color,
            fontWeight: 600,
            fontSize: '0.875rem',
            opacity: category.available ? 1 : 0.5,
          }}
        >
          {category.available ? 'Выбрать →' : 'Скоро...'}
        </Text>
      </div>

      {/* Градиентная линия внизу */}
      <div 
        className="card-bottom-line"
        style={{ 
          background: `linear-gradient(90deg, ${category.color}00 0%, ${category.color} 50%, ${category.color}00 100%)`
        }}
      />
    </Card>
  );
};

export default CategoryCard;