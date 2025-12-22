import React from "react";
import { Card, Input, Typography } from "antd";
import {
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  PhoneOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import AvatarWithFallback from "../AvatarWithFallback/AvatarWithFallback";
import styles from "./StaffListPanel.module.css";

const { Text } = Typography;
const { Search } = Input;

function StaffListPanel({
  staff = [],
  selectedUser = null,
  searchQuery = "",
  onSearchChange = () => {},
  onUserSelect = () => {},
  getDepartmentName = () => "",
  totalCount = 0,
  activeCount = 0,
  deletedCount = 0,
  noPhotoCount = 0,
  excludedCount = 0,
  showDeleted = false,
  showNoPhoto = false,
  dataVersion = 0, // Принимаем версию данных
}) {
  const renderUserStatus = (user) => {
    // Если сотрудник из исключенного отдела (сторонний)
    const statuses = [];
    if (user.isExcludedDepartment) {
      return (
        <span
          key="excluded"
          className={styles.excludedLabel}
          title="Сторонний отдел"
        >
          Сторонний отдел
        </span>
      );
    }

    if (user.isDeleted) {
      statuses.push(
        <span key="deleted" className={styles.deletedLabel} title="Уволен">
          Уволен
        </span>
      );
    }

    return (
      <div className={styles.statusContainer}>
        {statuses.map((status, index) => (
          <React.Fragment key={index}>
            {status}
            {index < statuses.length - 1 && <span style={{ marginRight: 4 }} />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const getEmptyText = () => {
    if (searchQuery) return "Ничего не найдено";
    if (showNoPhoto) return "Нет сотрудников без фото";
    if (showDeleted) return "Нет уволенных сотрудников";
    return "Нет сотрудников";
  };

  return (
    <Card
      className={styles.userListCard}
      styles={{
        body: {
          padding: "0",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
      variant={false}
    >
      <div className={styles.panelHeader}>
        <div className={styles.headerTop}>
          <div className={styles.titleSection}>
            <TeamOutlined className={styles.titleIcon} />
            <div className={styles.titleWrapper}>
              <div className={styles.titleRow}>
                <Text strong className={styles.panelTitle}>
                  Сотрудники
                </Text>
               
              </div>
            </div>
          </div>
        </div>

        <div className={styles.searchSection}>
          <Search
            placeholder={
              showNoPhoto
                ? "Поиск среди сотрудников без фото..."
                : "Поиск по ФИО, должности, отделу..."
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            prefix={<SearchOutlined />}
            size="middle"
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.userListContainer}>
        {staff.length === 0 ? (
          <div className={styles.emptyState}>
            <UserOutlined className={styles.emptyIcon} />
            <Text type="secondary" className={styles.emptyText}>
              {getEmptyText()}
            </Text>
          </div>
        ) : (
          <div className={styles.userListScroll}>
            {staff.map((user) => {
              const isSelected = selectedUser?.tabNumber === user.tabNumber;
              const isDeleted = user.isDeleted;
              const hasNoPhoto = !user.hasPhoto;

              return (
                <div
                  key={`${user.tabNumber}-${dataVersion}`} // Добавляем версию в ключ
                  className={`${styles.userItem} ${
                    isSelected ? styles.itemSelected : ""
                  } ${isDeleted ? styles.itemDeleted : ""} ${
                    hasNoPhoto ? styles.itemNoPhoto : ""
                  }`}
                  onClick={() => onUserSelect(user)}
                >
                  <div className={styles.itemAvatar}>
                    <AvatarWithFallback
                      tabNumber={user.tabNumber}
                      size={44}
                      className={styles.userAvatar}
                      timestamp={dataVersion} // Передаем версию как timestamp
                    />
                  </div>

                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <div className={styles.headerLeft}>
                        <Text strong className={styles.itemName}>
                          {user.fio || "Без имени"}
                        </Text>
                        {renderUserStatus(user)}
                      </div>

                      {user.telephone && (
                        <div className={styles.headerRight}>
                          <PhoneOutlined className={styles.phoneIcon} />
                          <Text className={styles.phoneText}>
                            {user.telephone}
                          </Text>
                        </div>
                      )}
                    </div>

                    {user.post && (
                      <Text type="secondary" className={styles.itemPosition}>
                        {user.post}
                      </Text>
                    )}

                    <div className={styles.departmentRow}>
                      <Text className={styles.itemDepartment}>
                        {getDepartmentName(user.department)}
                      </Text>
                    </div>
                  </div>

                  {isSelected && <div className={styles.selectionIndicator} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

export default React.memo(StaffListPanel);
