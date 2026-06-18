// src/components/ThemeSwitcherModal.jsx
import React, { useState } from 'react';
import { Modal, Card, Radio, Space, Button, Tag, Row, Col } from 'antd';
import { BgColorsOutlined, CheckCircleFilled, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { themes } from '../theme/themeConfig';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcherModal = () => {
  const [open, setOpen] = useState(false);
  const { currentThemeKey, changeTheme } = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelect = (key) => {
    changeTheme(key);
    handleClose();
  };

  return (
    <>
      <Button icon={<BgColorsOutlined />} onClick={handleOpen}>
        Тема
      </Button>
      <Modal
        title="Выберите оформление"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={600}
        centered
      >
        <Row gutter={[16, 16]}>
          {Object.entries(themes).map(([key, theme]) => (
            <Col xs={24} sm={12} key={key}>
              <Card
                hoverable
                onClick={() => handleSelect(key)}
                style={{
                  border: currentThemeKey === key ? `2px solid ${theme.mode === 'dark' ? '#fa922f' : '#1677ff'}` : '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Space>
                      {theme.mode === 'dark' ? <MoonOutlined /> : <SunOutlined />}
                      <strong>{theme.name}</strong>
                    </Space>
                    {currentThemeKey === key && <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />}
                  </Space>
                  <Space>
                    <Tag color={theme.mode === 'dark' ? '#2c2c2c' : '#f0f0f0'}>
                      {theme.mode === 'dark' ? 'Тёмная' : 'Светлая'}
                    </Tag>
                    {theme.config.token?.colorPrimary && (
                      <span>
                        Акцент:{' '}
                        <span
                          style={{
                            display: 'inline-block',
                            width: 24,
                            height: 24,
                            borderRadius: 4,
                            background: theme.config.token.colorPrimary,
                            border: '1px solid rgba(0,0,0,0.1)',
                            verticalAlign: 'middle',
                            marginLeft: 4,
                          }}
                        />
                      </span>
                    )}
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
};

export default ThemeSwitcherModal;