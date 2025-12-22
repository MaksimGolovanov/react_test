import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Upload,
  Badge,
  Tag,
  Spin,
  Alert,
  Typography,
  message,
  Skeleton,
  Tabs,
  Popconfirm,
  Dropdown,
  Menu,
} from "antd";
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
  MoreOutlined,
} from "@ant-design/icons";
import StaffService from "../../services/StaffService";
import styles from "./style.module.css";
import AvatarWithFallback from "../AvatarWithFallback/AvatarWithFallback";

const { Text, Title } = Typography;
const { TabPane } = Tabs;

function UserProfilePanel({ user, departments, onUpdate, onEdit, onDelete }) {
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [accessCards, setAccessCards] = useState([]);
  const [usbDevices, setUsbDevices] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadingUsb, setLoadingUsb] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [copyLoading, setCopyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cards");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  useEffect(() => {
    console.log("UserProfilePanel: user изменился", user);
    if (user) {
      setAvatarTimestamp(Date.now());
      setAvatarKey((prev) => prev + 1);
      setAccessCards([]);
      setUsbDevices([]);

      if (user.fio) {
        const loadUserData = async () => {
          try {
            setLoadingCards(true);
            const cards = await StaffService.fetchCardsByFio(user.fio);
            console.log("Загружены карты:", cards);
            setAccessCards(cards);
          } catch (error) {
            console.error("Ошибка при загрузке карт:", error);
          } finally {
            setLoadingCards(false);
          }

          try {
            setLoadingUsb(true);
            const usb = await StaffService.fetchUsbByFio(user.fio);
            console.log("Загружены USB:", usb);
            setUsbDevices(usb);
          } catch (error) {
            console.error("Ошибка при загрузке USB:", error);
          } finally {
            setLoadingUsb(false);
          }
        };

        loadUserData();
      }
    } else {
      setAccessCards([]);
      setUsbDevices([]);
    }
  }, [user]);

  // Функция для получения названия отдела
  const getDepartmentName = (departmentCode) => {
    if (!departmentCode || !departments) return "Не указано";
    const dept = departments.find(
      (d) =>
        d.code === String(departmentCode).split(" ")[0] ||
        d.code === departmentCode
    );
    return dept ? dept.description : "Неизвестный отдел";
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("ru-RU");
    } catch {
      return "-";
    }
  };

  // Функция копирования IP в буфер обмена
  const copyIpToClipboard = async () => {
    if (!user || !user.ip || user.ip === "-") {
      message.warning("IP адрес отсутствует");
      return;
    }

    setCopyLoading(true);
    try {
      await navigator.clipboard.writeText(user.ip);
      message.success(`IP адрес "${user.ip}" скопирован в буфер обмена`);
    } catch (error) {
      console.error("Ошибка копирования в буфер обмена:", error);

      // Fallback для старых браузеров
      try {
        const textArea = document.createElement("textarea");
        textArea.value = user.ip;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        message.success(`IP адрес "${user.ip}" скопирован в буфер обмена`);
      } catch (fallbackError) {
        console.error("Fallback также не сработал:", fallbackError);
        message.error("Не удалось скопировать IP адрес");
      }
    } finally {
      setCopyLoading(false);
    }
  };

  // Обработка загрузки фото
  const handlePhotoUpload = async () => {
    if (!selectedFile || !user?.tabNumber) return;

    try {
      await StaffService.uploadPhoto(user.tabNumber, selectedFile);

      setPhotoModalVisible(false);
      setSelectedFile(null);
      setPreviewImage(null);

      message.success("Фотография успешно обновлена!");

      // Сильно обновляем аватар
      setAvatarTimestamp(Date.now());
      setAvatarKey((prev) => prev + 1);

      // Если есть onUpdate, вызываем его
      if (onUpdate) {
        onUpdate();

        // Также можно принудительно перезагрузить данные пользователя
        // через короткую задержку
        setTimeout(() => {
          // Перезагружаем данные карт и USB
          if (user.fio) {
            fetchUserData();
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Ошибка при загрузке фото:", error);
      message.error("Не удалось загрузить фото");
    }
  };

  const fetchUserData = async () => {
    if (!user?.fio) return;

    try {
      setLoadingCards(true);
      const cards = await StaffService.fetchCardsByFio(user.fio);
      setAccessCards(cards);
    } catch (error) {
      console.error("Ошибка при загрузке карт:", error);
    } finally {
      setLoadingCards(false);
    }

    try {
      setLoadingUsb(true);
      const usb = await StaffService.fetchUsbByFio(user.fio);
      setUsbDevices(usb);
    } catch (error) {
      console.error("Ошибка при загрузке USB:", error);
    } finally {
      setLoadingUsb(false);
    }
  };

  // Обработчики для кнопок редактирования и удаления
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  // Меню для Dropdown (если нужно скрыть кнопки)
  const moreMenu = (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={handleEdit}
        disabled={!user} // Только проверяем наличие пользователя
      >
        Редактировать
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => setDeleteConfirmVisible(true)}
        disabled={!user} // Только проверяем наличие пользователя
      >
        {user?.isDeleted ? "Окончательно удалить" : "Удалить"}
      </Menu.Item>
    </Menu>
  );

  // Если пользователь не выбран, показываем Skeleton
  if (!user) {
    return (
      <div className={styles.profileContainer}>
        {/* Верхняя часть с заголовком - Skeleton */}
        <Card className={styles.profileHeader}>
          <div className={styles.headerTopHalf} />
          <div className={styles.avatarWrapper}>
            <Skeleton.Avatar
              active
              size={150}
              shape="circle"
              style={{ border: "3px solid white" }}
            />
          </div>
          <div className={styles.userInfoOverlay}>
            <Skeleton.Input
              active
              size="small"
              style={{ width: "60%", height: 24 }}
            />
            <div style={{ marginTop: 8 }}>
              <Skeleton.Input
                active
                size="small"
                style={{ width: "40%", height: 16 }}
              />
            </div>
          </div>
        </Card>

        {/* Основная информация - Skeleton */}
        <Card className={styles.mainInfoCard}>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <div className={styles.infoSection}>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 120, marginBottom: 12 }}
                />
                <div style={{ display: "grid", gap: 10 }}>
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className={styles.infoSection}>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 120, marginBottom: 12 }}
                />
                <div style={{ display: "grid", gap: 10 }}>
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                  <Skeleton.Input active size="small" />
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Карты и USB в вкладках - Skeleton */}
        <Card className={styles.devicesCard}>
          {/* Скелетон для вкладок */}
          <div className={styles.tabsSkeleton}>
            <Skeleton.Input
              active
              size="small"
              style={{
                width: 120,
                height: 32,
                margin: "0 16px 0 0",
              }}
            />
            <Skeleton.Input
              active
              size="small"
              style={{
                width: 120,
                height: 32,
              }}
            />
          </div>

          {/* Скелетон для контента вкладки */}
          <div className={styles.tabContentSkeleton}>
            <div style={{ marginBottom: 12 }}>
              <Skeleton.Input
                active
                size="small"
                style={{
                  width: "100%",
                  height: 32,
                }}
              />
            </div>
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Верхняя часть с заголовком */}
      <Card className={styles.profileHeader} size="small">
        {/* Фоновое изображение/градиент */}
        <div className={styles.headerTopHalf} />

        {/* Аватар - перекрывает верхнюю часть */}
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarContainer}>
            <AvatarWithFallback
              key={`avatar-${user.tabNumber}-${avatarTimestamp}`}
              tabNumber={user.tabNumber}
              size={150}
              className={styles.userAvatar}
              fallbackSrc={`${process.env.REACT_APP_API_URL}static/photo/no.jpg?t=${avatarTimestamp}`}
            />
            <Button
              type="link"
              icon={<CameraOutlined />}
              className={styles.photoEditButton}
              onClick={() => setPhotoModalVisible(true)}
            />
          </div>
        </div>

        {/* ФИО и должность - справа от аватара на фоне */}
        <div
          className={`${styles.userInfoOverlay} ${
            String(user.del) === "1" ? styles.userInfoOverlayFired : ""
          }`}
        >
          <div className={styles.userInfoHeader}>
            <div className={styles.userInfoText}>
              <Title level={3} className={styles.userName}>
                {user.fio || "Неизвестный сотрудник"}
              </Title>
              <div className={styles.userInfoDetails}>
                <Text strong className={styles.userPosition}>
                  {user.post || "Должность не указана"}
                </Text>
                <Text className={styles.userDepartment}>
                  {getDepartmentName(user.department)}
                </Text>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className={styles.userActions}>
              {user && ( // Проверяем только наличие пользователя
                <>
                  <Button
                    color="default"
                    variant="link"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    title="Редактировать сотрудника"
                    disabled={!user} // Можно оставить для согласованности
                  />
                  <Popconfirm
                    title={
                      user.isDeleted
                        ? "Окончательное удаление сотрудника"
                        : "Удаление сотрудника"
                    }
                    description={
                      user.isDeleted
                        ? `Вы уверены, что хотите окончательно удалить сотрудника ${user.fio}?`
                        : `Вы уверены, что хотите удалить сотрудника ${user.fio}?`
                    }
                    open={deleteConfirmVisible}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteConfirmVisible(false)}
                    okText={user.isDeleted ? "Окончательно удалить" : "Удалить"}
                    cancelText="Отмена"
                    okType="danger"
                  >
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      danger
                      className={styles.actionButton}
                      title={
                        user.isDeleted ? "Окончательно удалить" : "Удалить"
                      }
                      onClick={() => setDeleteConfirmVisible(true)}
                      disabled={!user} // Можно оставить для согласованности
                    />
                  </Popconfirm>
                </>
              )}

              {/* Альтернативный вариант с Dropdown */}
              {/* <Dropdown overlay={moreMenu} placement="bottomRight">
                                        <Button type="text" icon={<MoreOutlined />} className={styles.actionButton} />
                                   </Dropdown> */}
            </div>
          </div>
        </div>
      </Card>

      {/* Основная информация о пользователе */}
      <Card className={styles.mainInfoCard}>
        <Row gutter={[16, 12]}>
          {/* Левая колонка с основной информацией */}
          <Col xs={24} md={12}>
            <div className={styles.infoSection}>
              <div className={styles.sectionTitle}>
                <IdcardOutlined className={styles.sectionIcon} />
                <Text strong className={styles.sectionTitleText}>
                  Основная информация
                </Text>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Табельный номер</div>
                  <Text className={styles.infoValue}>
                    {user.tabNumber || "-"}
                  </Text>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Логин</div>
                  <Text className={styles.infoValue}>{user.login || "-"}</Text>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Служба/Отдел</div>
                  <Text className={styles.infoValue}>
                    {getDepartmentName(user.department)}
                  </Text>
                </div>
              </div>
            </div>
          </Col>

          {/* Правая колонка с контактной информацией */}
          <Col xs={24} md={12}>
            <div className={styles.infoSection}>
              <div className={styles.sectionTitle}>
                <ContactsOutlined className={styles.sectionIcon} />
                <Text strong className={styles.sectionTitleText}>
                  Контактная информация
                </Text>
              </div>

              <div className={styles.infoGrid}>
                {user.telephone && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Телефон</div>
                    <a
                      href={`tel:${user.telephone}`}
                      className={styles.contactLink}
                    >
                      <PhoneOutlined className={styles.contactIcon} />
                      {user.telephone}
                    </a>
                  </div>
                )}

                {user.email && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Email</div>
                    <a
                      href={`mailto:${user.email}`}
                      className={styles.contactLink}
                    >
                      <MailOutlined className={styles.contactIcon} />
                      {user.email}
                    </a>
                  </div>
                )}

                {user.ip && user.ip !== "-" && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>IP адрес</div>
                    <div className={styles.ipContainer}>
                      <Text className={styles.ipText}>
                        <LaptopOutlined className={styles.contactIcon} />
                        {user.ip}
                      </Text>
                      <Button
                        type="link"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={copyIpToClipboard}
                        loading={copyLoading}
                        className={styles.copyButton}
                        title="Скопировать IP"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Карты доступа и USB устройства в вкладках */}
      <Card className={styles.devicesCard}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.devicesTabs}
        >
          <TabPane
            tab={
              <span className={styles.tabTitle}>
                <KeyOutlined className={styles.tabIcon} />
                Карты доступа
                <Badge
                  count={accessCards.length}
                  size="small"
                  className={styles.tabBadge}
                />
              </span>
            }
            key="cards"
          >
            <div className={styles.tabContent}>
              {loadingCards ? (
                <div className={styles.tabContentSkeleton}>
                  <Skeleton.Input
                    active
                    size="small"
                    style={{
                      width: "100%",
                      height: 32,
                      marginBottom: 12,
                    }}
                  />
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              ) : accessCards.length === 0 ? (
                <Alert
                  message="Карты доступа не найдены"
                  type="info"
                  showIcon
                  className={styles.emptyAlert}
                />
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.deviceTable}>
                    <thead>
                      <tr>
                        <th>Сер. №</th>
                        <th>Тип</th>
                        <th>Описание</th>
                        <th>Проверка</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessCards.slice(0, 5).map((card, index) => (
                        <tr
                          key={card.id}
                          className={
                            index % 2 === 0
                              ? styles.tableRowEven
                              : styles.tableRowOdd
                          }
                        >
                          <td className={styles.tableCellBold}>
                            {card.ser_num || "-"}
                          </td>
                          <td className={styles.tableCell}>
                            {card.type || "-"}
                          </td>
                          <td
                            className={styles.tableCell}
                            title={card.description}
                          >
                            <span className={styles.truncatedText}>
                              {card.description || "-"}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            {formatDate(card.data_prov)}
                          </td>
                          <td className={styles.tableCell}>
                            <Badge
                              status={card.log === "Да" ? "success" : "default"}
                              text={
                                <span
                                  className={
                                    card.log === "Да"
                                      ? styles.statusActive
                                      : styles.statusInactive
                                  }
                                >
                                  {card.log === "Да" ? "Активна" : "Не активна"}
                                </span>
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabPane>

          <TabPane
            tab={
              <span className={styles.tabTitle}>
                <UsbOutlined className={styles.tabIcon} />
                USB устройства
                <Badge
                  count={usbDevices.length}
                  size="small"
                  className={styles.tabBadge}
                />
              </span>
            }
            key="usb"
          >
            <div className={styles.tabContent}>
              {loadingUsb ? (
                <div className={styles.tabContentSkeleton}>
                  <Skeleton.Input
                    active
                    size="small"
                    style={{
                      width: "100%",
                      height: 32,
                      marginBottom: 12,
                    }}
                  />
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              ) : usbDevices.length === 0 ? (
                <Alert
                  message="USB устройства не найдены"
                  type="info"
                  showIcon
                  className={styles.emptyAlert}
                />
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.deviceTable}>
                    <thead>
                      <tr>
                        <th>№ формы</th>
                        <th>Сер. №</th>
                        <th>Объем</th>
                        <th>Проверка</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usbDevices.slice(0, 5).map((device, index) => (
                        <tr
                          key={device.id}
                          className={
                            index % 2 === 0
                              ? styles.tableRowEven
                              : styles.tableRowOdd
                          }
                        >
                          <td className={styles.tableCellBold}>
                            {device.num_form || "-"}
                          </td>
                          <td className={styles.tableCell}>
                            {device.ser_num || "-"}
                          </td>
                          <td className={styles.tableCell}>
                            {device.volume || "-"}
                          </td>
                          <td className={styles.tableCell}>
                            {formatDate(device.data_prov)}
                          </td>
                          <td className={styles.tableCell}>
                            <Badge
                              status={
                                device.log === "Да" ? "success" : "default"
                              }
                              text={
                                <span
                                  className={
                                    device.log === "Да"
                                      ? styles.statusActive
                                      : styles.statusInactive
                                  }
                                >
                                  {device.log === "Да"
                                    ? "Активно"
                                    : "Не активно"}
                                </span>
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Модальное окно для загрузки фото */}
      <Modal
        title="Изменение фотографии"
        open={photoModalVisible}
        onCancel={() => {
          setPhotoModalVisible(false);
          setSelectedFile(null);
          setPreviewImage(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setPhotoModalVisible(false)}>
            Отмена
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={handlePhotoUpload}
            disabled={!selectedFile}
          >
            Сохранить фото
          </Button>,
        ]}
        width={400}
      >
        <Form layout="vertical">
          <Form.Item label="Выберите изображение">
            <Upload
              accept="image/*"
              beforeUpload={(file) => {
                if (file) {
                  setSelectedFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (reader.result) {
                      setPreviewImage(reader.result);
                    }
                  };
                  reader.readAsDataURL(file);
                }
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<CameraOutlined />} style={{ width: "100%" }}>
                Выбрать файл
              </Button>
            </Upload>
          </Form.Item>

          {previewImage && (
            <Form.Item label="Предпросмотр">
              <div className={styles.previewContainer}>
                <img
                  src={previewImage}
                  alt="Предпросмотр"
                  className={styles.previewImage}
                />
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default UserProfilePanel;
