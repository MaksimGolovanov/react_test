import { Typography, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import './PageHeader.css';

const { Title } = Typography;

const PageHeader = ({ loading, onRefresh }) => {
  return (
    <Space className="page-header">
      <div>
        <Title level={2}>Обучение по информационной безопасности</Title>
      </div>
      <Button
        type="primary"
        size="small"   // исправлено: было "smail"
        icon={<ReloadOutlined />}
        onClick={onRefresh}
        loading={loading}
      >
        Обновить
      </Button>
    </Space>
  );
};

export default PageHeader;