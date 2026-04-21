import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Progress, Timeline, Tag } from 'antd';
import { 
  FileTextOutlined, 
  StarOutlined, 
  InboxOutlined,
  CalendarOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import NoteService from '../services/NoteService';

const NoteStats = ({ posts }) => {
  const [stats, setStats] = useState({
    total: 0,
    favorite: 0,
    archived: 0,
    recent: 0
  });

  useEffect(() => {
    if (posts && posts.length > 0) {
      const favoriteCount = posts.filter(p => p.isFavorite).length;
      const archivedCount = posts.filter(p => p.isArchived).length;
      const recentCount = posts.filter(p => {
        const createdAt = new Date(p.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }).length;

      setStats({
        total: posts.length,
        favorite: favoriteCount,
        archived: archivedCount,
        recent: recentCount
      });
    }
  }, [posts]);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Всего заметок"
            value={stats.total}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="В избранном"
            value={stats.favorite}
            prefix={<StarOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
          <Progress 
            percent={stats.total ? (stats.favorite / stats.total * 100) : 0} 
            size="small" 
            strokeColor="#faad14"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="В архиве"
            value={stats.archived}
            prefix={<InboxOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="За последнюю неделю"
            value={stats.recent}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default NoteStats;