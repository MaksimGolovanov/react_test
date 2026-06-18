import React from "react";
import { Input, Typography, theme } from "antd";
import { SearchOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import AvatarWithFallback from "../AvatarWithFallback/AvatarWithFallback";
import styles from "./StaffListPanel.module.css";

const { Text } = Typography;
const { Search } = Input;
const { useToken } = theme;

function StaffListPanel({
  staff = [],
  selectedUser = null,
  searchQuery = "",
  onSearchChange = () => {},
  onUserSelect = () => {},
  totalCount = 0,
  activeCount = 0,
  deletedCount = 0,
  noPhotoCount = 0,
  excludedCount = 0,
  showDeleted = false,
  showNoPhoto = false,
  dataVersion = 0,
}) {
  const { token } = useToken();

  const renderUserStatus = (user) => {
    if (user.isExcludedDepartment) {
      return (
        <span className={styles.excludedLabel} style={{ backgroundColor: token.colorWarningBg, color: token.colorWarning }}>
          Сторонний отдел
        </span>
      );
    }
    if (user.isDeleted) {
      return (
        <span className={styles.deletedLabel} style={{ backgroundColor: token.colorError, color: '#fff' }}>
          Уволен
        </span>
      );
    }
    return null;
  };

  const getEmptyText = () => {
    if (searchQuery) return "Ничего не найдено";
    if (showNoPhoto) return "Нет сотрудников без фото";
    if (showDeleted) return "Нет уволенных сотрудников";
    return "Нет сотрудников";
  };

  return (
    <div className={styles.userListCard}>
      <div className={styles.panelHeader} style={{ borderBottomColor: token.colorBorder }}>
        <div className={styles.headerTop}>
          <div className={styles.titleSection}>
            <div className={styles.titleWrapper}>
              <div className={styles.titleRow}>
                <Text strong className={styles.panelTitle} style={{ color: token.colorText }}>
                  Сотрудники
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.searchSection}>
          <Search
            placeholder={showNoPhoto ? "Поиск среди сотрудников без фото..." : "Поиск по ФИО, должности, отделу..."}
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
            <UserOutlined className={styles.emptyIcon} style={{ color: token.colorTextDisabled }} />
            <Text type="secondary" className={styles.emptyText}>
              {getEmptyText()}
            </Text>
          </div>
        ) : (
          <div className={styles.userListScroll}>
            {staff.map((user) => {
              const isSelected = selectedUser?.tabNumber === user.tabNumber;
              return (
                <div
                  key={`${user.tabNumber}-${dataVersion}`}
                  className={`${styles.userItem} ${isSelected ? styles.itemSelected : ""}`}
                  onClick={() => onUserSelect(user)}
                  style={{
                    borderColor: token.colorBorder,
                    backgroundColor: token.colorBgContainer,
                  }}
                >
                  <div className={styles.itemAvatar}>
                    <AvatarWithFallback
                      tabNumber={user.tabNumber}
                      size={44}
                      timestamp={dataVersion}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <div className={styles.headerLeft}>
                        <Text strong className={styles.itemName} style={{ color: token.colorText }}>
                          {user.fio || "Без имени"}
                        </Text>
                        {renderUserStatus(user)}
                      </div>
                      {user.telephone && (
                        <div className={styles.headerRight}>
                          <PhoneOutlined className={styles.phoneIcon} style={{ color: token.colorPrimary }} />
                          <Text className={styles.phoneText} style={{ color: token.colorPrimary }}>
                            {user.telephone}
                          </Text>
                        </div>
                      )}
                    </div>
                    {user.post && (
                      <Text type="secondary" className={styles.itemPosition} style={{ color: token.colorTextSecondary }}>
                        {user.post}
                      </Text>
                    )}
                    <div className={styles.departmentRow}>
                      <Text className={styles.itemDepartment} style={{ color: token.colorTextTertiary }}>
                        {user.departmentName || "Не указано"}
                      </Text>
                    </div>
                  </div>
                  {isSelected && <div className={styles.selectionIndicator} style={{ backgroundColor: token.colorPrimary }} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(StaffListPanel);