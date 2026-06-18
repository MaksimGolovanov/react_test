import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Upload,
  Badge,
  Alert,
  Typography,
  message,
  Skeleton,
  Tabs,
  Popconfirm,
  theme,
} from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  LaptopOutlined,
  CameraOutlined,
  KeyOutlined,
  UsbOutlined,
  CopyOutlined,
  IdcardOutlined,
  ContactsOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
} from '@ant-design/icons';
import StaffService from '../../services/StaffService';
import PositionAccessService from '../../services/PositionAccessService';
import styles from './style.module.css';
import AvatarWithFallback from '../AvatarWithFallback/AvatarWithFallback';

const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { useToken } = theme;

function UserProfilePanel({ user, onUpdate, onEdit, onDelete }) {
  const { token } = useToken();
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [accessCards, setAccessCards] = useState([]);
  const [usbDevices, setUsbDevices] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadingUsb, setLoadingUsb] = useState(false);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [copyLoading, setCopyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [confidentialPoints, setConfidentialPoints] = useState([]);
  const [loadingConfidential, setLoadingConfidential] = useState(false);

  useEffect(() => {
    if (!user || !user.department || !user.post) {
      setConfidentialPoints([]);
      return;
    }
    const loadPoints = async () => {
      setLoadingConfidential(true);
      try {
        // Передаём полную строку department как код отдела
        const points = await PositionAccessService.fetchByStaff(
          user.department, // теперь это полная строка
          user.post
        );
        setConfidentialPoints(points);
      } catch (error) {
        console.error('Ошибка загрузки пунктов КТ:', error);
        setConfidentialPoints([]);
        message.error('Не удалось загрузить пункты конфиденциальной информации');
      } finally {
        setLoadingConfidential(false);
      }
    };
    loadPoints();
  }, [user]);

  useEffect(() => {
    if (user && user.fio) {
      const loadUserDevices = async () => {
        setLoadingCards(true);
        try {
          const cards = await StaffService.fetchCardsByFio(user.fio);
          setAccessCards(cards);
        } catch (error) {
          console.error('Ошибка загрузки карт:', error);
        } finally {
          setLoadingCards(false);
        }

        setLoadingUsb(true);
        try {
          const usb = await StaffService.fetchUsbByFio(user.fio);
          setUsbDevices(usb);
        } catch (error) {
          console.error('Ошибка загрузки USB:', error);
        } finally {
          setLoadingUsb(false);
        }
      };
      loadUserDevices();
    } else {
      setAccessCards([]);
      setUsbDevices([]);
    }
  }, [user]);

  useEffect(() => {
    setAvatarTimestamp(Date.now());
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch {
      return '-';
    }
  };

  const copyIpToClipboard = async () => {
    if (!user?.ip) {
      message.warning('IP адрес отсутствует');
      return;
    }
    setCopyLoading(true);
    try {
      await navigator.clipboard.writeText(user.ip);
      message.success(`IP адрес "${user.ip}" скопирован`);
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = user.ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        message.success(`IP адрес "${user.ip}" скопирован`);
      } catch {
        message.error('Не удалось скопировать IP');
      }
    } finally {
      setCopyLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile || !user?.tabNumber) return;
    try {
      await StaffService.uploadPhoto(user.tabNumber, selectedFile);
      setPhotoModalVisible(false);
      setSelectedFile(null);
      setPreviewImage(null);
      message.success('Фото обновлено!');
      setAvatarTimestamp(Date.now());
      if (onUpdate) onUpdate();
    } catch {
      message.error('Не удалось загрузить фото');
    }
  };

  const overlayBg = token.colorBgContainer + 'cc';

  if (!user) {
    return (
      <div className={styles.profileContainer}>
        <Card className={styles.profileHeader}>
          <div className={styles.headerTopHalf} style={{ background: token.colorPrimary }} />
          <div className={styles.avatarWrapper}>
            <Skeleton.Avatar active size={150} shape="circle" style={{ border: `3px solid ${token.colorBgContainer}` }} />
          </div>
          <div className={styles.userInfoOverlay}>
            <Skeleton.Input active size="small" style={{ width: '60%', height: 24 }} />
            <div style={{ marginTop: 8 }}>
              <Skeleton.Input active size="small" style={{ width: '40%', height: 16 }} />
            </div>
          </div>
        </Card>
        <Card className={styles.mainInfoCard}>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <div className={styles.infoSection}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className={styles.infoSection}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            </Col>
          </Row>
        </Card>
        <Card className={styles.devicesCard}>
          <div className={styles.tabsSkeleton}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        </Card>
      </div>
    );
  }

  const isDeleted = String(user.del) === '1';

  const renderDeviceTable = (title, devices, columns, renderRow) => {
    if (devices.length === 0) {
      return <Alert message={`${title} не найдены`} type="info" showIcon />;
    }
    return (
      <div className={styles.tableContainer}>
        <table className={styles.deviceTable}>
          <thead style={{ background: token.colorBgLayout, borderBottom: `1px solid ${token.colorBorder}` }}>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ color: token.colorText, fontWeight: 600, padding: '10px 12px', textAlign: 'left' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {devices.slice(0, 5).map((device, idx) => {
              const rowBackground = idx % 2 === 0 ? token.colorBgContainer : token.colorBgLayout;
              return (
                <tr key={device.id} style={{ background: rowBackground, borderBottom: `1px solid ${token.colorBorder}` }}>
                  {renderRow(device)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const cardColumns = ['Сер. №', 'Тип', 'Описание', 'Проверка', 'Статус'];
  const usbColumns = ['№ формы', 'Сер. №', 'Объем', 'Проверка', 'Статус'];

  return (
    <div className={styles.profileContainer}>
      <div
        className={styles.profileHeader}
        style={{
          background: `linear-gradient(180deg, ${token.colorPrimary} 0%, ${token.colorPrimary} 45%, transparent 55%, transparent 100%)`,
        }}
      >
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarContainer}>
            <AvatarWithFallback
              key={`avatar-${user.tabNumber}-${avatarTimestamp}`}
              tabNumber={user.tabNumber}
              size={150}
              className={styles.userAvatar}
            />
            <Button
              type="link"
              icon={<CameraOutlined />}
              className={styles.photoEditButton}
              onClick={() => setPhotoModalVisible(true)}
              style={{
                background: token.colorBgContainer,
                color: token.colorPrimary,
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </div>
        </div>
        <div
          className={`${styles.userInfoOverlay} ${isDeleted ? styles.userInfoOverlayFired : ''}`}
          style={{
            backgroundColor: isDeleted ? 'rgba(220, 53, 69, 0.8)' : overlayBg,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div className={styles.userInfoHeader}>
            <div className={styles.userInfoText}>
              <Title level={3} className={styles.userName} style={{ color: token.colorText }}>
                {user.fio || 'Неизвестный сотрудник'}
              </Title>
              <div className={styles.userInfoDetails}>
                <Text strong className={styles.userPosition} style={{ color: token.colorTextSecondary }}>
                  {user.post || 'Должность не указана'}
                </Text>
                <Text className={styles.userDepartment} style={{ color: token.colorPrimary }}>
                  {user.departmentName || 'Не указано'}
                </Text>
              </div>
            </div>
            <div className={styles.userActions}>
              <Button type="link" icon={<EditOutlined />} onClick={onEdit} title="Редактировать" style={{ color: token.colorTextSecondary }} />
              <Popconfirm
                title={isDeleted ? 'Окончательное удаление' : 'Удаление сотрудника'}
                description={`Вы уверены, что хотите ${isDeleted ? 'окончательно удалить' : 'удалить'} ${user.fio}?`}
                open={deleteConfirmVisible}
                onConfirm={onDelete}
                onCancel={() => setDeleteConfirmVisible(false)}
                okText={isDeleted ? 'Окончательно удалить' : 'Удалить'}
                cancelText="Отмена"
                okType="danger"
              >
                <Button type="link" icon={<DeleteOutlined />} danger onClick={() => setDeleteConfirmVisible(true)} style={{ color: token.colorError }} />
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>

      <Card className={styles.mainInfoCard}>
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <div className={styles.infoSection}>
              <div className={styles.sectionTitle} style={{ borderBottomColor: token.colorBorder }}>
                <IdcardOutlined className={styles.sectionIcon} style={{ color: token.colorPrimary }} />
                <Text strong className={styles.sectionTitleText}>Основная информация</Text>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel} style={{ color: token.colorTextSecondary }}>Табельный номер</div>
                  <Text className={styles.infoValue} style={{ color: token.colorText }}>{user.tabNumber || '-'}</Text>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel} style={{ color: token.colorTextSecondary }}>Логин</div>
                  <Text className={styles.infoValue} style={{ color: token.colorText }}>{user.login || '-'}</Text>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel} style={{ color: token.colorTextSecondary }}>Служба/Отдел</div>
                  <Text className={styles.infoValue} style={{ color: token.colorText }}>{user.departmentName || 'Не указано'}</Text>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className={styles.infoSection}>
              <div className={styles.sectionTitle} style={{ borderBottomColor: token.colorBorder }}>
                <ContactsOutlined className={styles.sectionIcon} style={{ color: token.colorPrimary }} />
                <Text strong className={styles.sectionTitleText}>Контактная информация</Text>
              </div>
              <div className={styles.infoGrid}>
                {user.telephone && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel} style={{ color: token.colorTextSecondary }}>Телефон</div>
                    <a href={`tel:${user.telephone}`} className={styles.contactLink} style={{ color: token.colorPrimary }}>
                      <PhoneOutlined className={styles.contactIcon} /> {user.telephone}
                    </a>
                  </div>
                )}
                {user.email && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel} style={{ color: token.colorTextSecondary }}>Email</div>
                    <a href={`mailto:${user.email}`} className={styles.contactLink} style={{ color: token.colorPrimary }}>
                      <MailOutlined className={styles.contactIcon} /> {user.email}
                    </a>
                  </div>
                )}
                {user.ip && user.ip !== '-' && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel} style={{ color: token.colorTextSecondary }}>IP адрес</div>
                    <div className={styles.ipContainer}>
                      <Text className={styles.ipText} style={{ color: token.colorText }}>
                        <LaptopOutlined /> {user.ip}
                      </Text>
                      <Button type="link" size="small" icon={<CopyOutlined />} onClick={copyIpToClipboard} loading={copyLoading} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card className={styles.devicesCard}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} className={styles.devicesTabs}>
          <TabPane
            tab={<span><KeyOutlined /> Карты доступа <Badge count={accessCards.length} size="small" /></span>}
            key="cards"
          >
            <div className={styles.tabContent}>
              {loadingCards ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : (
                renderDeviceTable('Карты доступа', accessCards, cardColumns, (card) => (
                  <>
                    <td className={styles.tableCellBold} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>{card.ser_num || '-'}</td>
                    <td className={styles.tableCell} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>{card.type || '-'}</td>
                    <td className={styles.tableCell} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>{card.description || '-'}</td>
                    <td className={styles.tableCell} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>{formatDate(card.data_prov)}</td>
                    <td className={styles.tableCell} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>
                      <Badge status={card.log === 'Да' ? 'success' : 'default'} text={card.log === 'Да' ? 'Активна' : 'Не активна'} />
                    </td>
                  </>
                ))
              )}
            </div>
          </TabPane>
          <TabPane
            tab={<span><UsbOutlined /> USB устройства <Badge count={usbDevices.length} size="small" /></span>}
            key="usb"
          >
            <div className={styles.tabContent}>
              {loadingUsb ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : (
                renderDeviceTable('USB устройства', usbDevices, usbColumns, (dev) => (
                  <>
                    <td className={styles.tableCellBold} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>{dev.num_form || '-'}</td>
                    <td className={styles.tableCell} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>{dev.ser_num || '-'}</td>
                    <td className={styles.tableCell} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>{dev.volume || '-'}</td>
                    <td className={styles.tableCell} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>{formatDate(dev.data_prov)}</td>
                    <td className={styles.tableCell} style={{ color: token.colorText, borderBottom: `1px solid ${token.colorBorder}` }}>
                      <Badge status={dev.log === 'Да' ? 'success' : 'default'} text={dev.log === 'Да' ? 'Активно' : 'Не активно'} />
                    </td>
                  </>
                ))
              )}
            </div>
          </TabPane>
          <TabPane
            tab={<span><LockOutlined /> Пункты КТ <Badge count={confidentialPoints.length} size="small" /></span>}
            key="confidential"
          >
            <div className={styles.tabContent}>
              {loadingConfidential ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : confidentialPoints.length === 0 ? (
                <Alert message="Нет назначенных пунктов" description="Для должности данного сотрудника не указаны пункты конфиденциальной информации." type="info" showIcon className={styles.emptyAlert} />
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.deviceTable}>
                    <thead style={{ background: token.colorBgLayout, borderBottom: `1px solid ${token.colorBorder}` }}>
                      <tr>
                        <th style={{ color: token.colorText, padding: '10px 12px' }}>№ пункта</th>
                        <th style={{ color: token.colorText, padding: '10px 12px' }}>Описание информации</th>
                        <th style={{ color: token.colorText, padding: '10px 12px' }}>Гриф</th>
                        <th style={{ color: token.colorText, padding: '10px 12px' }}>Срок доступа</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confidentialPoints.map((point, idx) => {
                        const rowBackground = idx % 2 === 0 ? token.colorBgContainer : token.colorBgLayout;
                        return (
                          <tr key={point.id} style={{ background: rowBackground, borderBottom: `1px solid ${token.colorBorder}` }}>
                            <td className={styles.tableCellBold} style={{ color: token.colorText }}>{point.item_number || '-'}</td>
                            <td className={styles.tableCell} style={{ color: token.colorText }}>{point.information_description || '-'}</td>
                            <td className={styles.tableCell} style={{ color: token.colorText }}>{point.confidentiality_mark || '-'}</td>
                            <td className={styles.tableCell} style={{ color: token.colorText }}>{point.access_period || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Изменение фотографии"
        open={photoModalVisible}
        onCancel={() => {
          setPhotoModalVisible(false);
          setSelectedFile(null);
          setPreviewImage(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setPhotoModalVisible(false)}>Отмена</Button>,
          <Button key="upload" type="primary" onClick={handlePhotoUpload} disabled={!selectedFile}>Сохранить фото</Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Выберите изображение">
            <Upload
              accept="image/*"
              beforeUpload={(file) => {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setPreviewImage(reader.result);
                reader.readAsDataURL(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<CameraOutlined />}>Выбрать файл</Button>
            </Upload>
          </Form.Item>
          {previewImage && (
            <Form.Item label="Предпросмотр">
              <img src={previewImage} alt="Предпросмотр" className={styles.previewImage} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default UserProfilePanel;