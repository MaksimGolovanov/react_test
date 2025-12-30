import React, { useState } from "react";
import { Button, Flex, Tooltip, Switch, Input, Space, Badge } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
  SettingOutlined,
  ReloadOutlined,
  CopyOutlined,
  CheckOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./TopActionsPanel.module.css";

const TopActionsPanel = ({
  onCreate,
  onEdit,
  onDelete,
  onImport,
  onExport,
  onSprav,
  onPsw,
  onToggleDeleted,
  onToggleNoPhoto,
  selectedUser,
  showDeleted,
  showNoPhoto,
  exportLoading,
  className = "",
  generatedPassword,
  onGeneratePassword,
  onCopyPassword,
  passwordCopied,
  showPasswordField,
  noPhotoCount = 0,
  onClearSearch = () => {}, // Новый prop для очистки поиска
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Обработчик переключения уволенных с очисткой поиска
  const handleToggleDeleted = (checked) => {
    onToggleDeleted(checked);
    onClearSearch(); // Очищаем поиск при переключении
  };

  // Обработчик переключения "без фото" с очисткой поиска
  const handleToggleNoPhoto = (checked) => {
    onToggleNoPhoto(checked);
    onClearSearch(); // Очищаем поиск при переключении
  };

  return (
    <div className={`${styles.topPanel} ${className}`}>
      <Flex gap="small" align="center" wrap="wrap">
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          Создать
        </Button>

        <Button type="primary" icon={<ImportOutlined />} onClick={onImport}>
          Импорт
        </Button>
        <Button
          type="primary"
          icon={<ExportOutlined />}
          onClick={onExport}
          loading={exportLoading}
        >
          Экспорт
        </Button>
        <Button type="primary" icon={<SettingOutlined />} onClick={onSprav}>
          Справочник
        </Button>

        {/* Переключатель отображения уволенных */}
        <Tooltip
          title={showDeleted ? "Скрыть уволенных" : "Показать уволенных"}
        >
          <div className={styles.toggleContainer}>
            <Switch
              checked={showDeleted}
              onChange={handleToggleDeleted} // Используем новый обработчик
              checkedChildren={<EyeOutlined />}
              unCheckedChildren={<EyeInvisibleOutlined />}
              size="small"
            />
            <span className={styles.toggleLabel}>
              {showDeleted ? "Уволенные" : "Только активные"}
            </span>
          </div>
        </Tooltip>

        {/* Переключатель отображения сотрудников без фото */}
        <Tooltip
          title={showNoPhoto ? "Показать всех" : "Показать только без фото"}
        >
          <div className={styles.toggleContainer}>
            <Badge
              count={showNoPhoto ? 0 : noPhotoCount}
              size="small"
              offset={[5, -5]}
            >
              <Switch
                checked={showNoPhoto}
                onChange={handleToggleNoPhoto} // Используем новый обработчик
                checkedChildren={<UserOutlined />}
                unCheckedChildren={<UserOutlined />}
                size="small"
              />
            </Badge>
            <span className={styles.toggleLabel}>
              {showNoPhoto ? "Без фото" : "Все"}
            </span>
          </div>
        </Tooltip>

        {/* Генератор пароля */}
        <Space.Compact>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={onGeneratePassword}
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          >
            Пароль
          </Button>
          {showPasswordField && (
            <>
              <Space.Compact>
                <Input
                  value={generatedPassword || ""}
                  placeholder="Сгенерированный пароль"
                  readOnly
                  style={{ width: 180 }}
                  type={showPassword ? "text" : "password"}
                />
              </Space.Compact>
              <Tooltip
                title={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                <Button
                  icon={
                    showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />
                  }
                  onClick={() => setShowPassword(!showPassword)}
                />
              </Tooltip>
              <Tooltip
                title={passwordCopied ? "Скопировано!" : "Копировать в буфер"}
              >
                <Button
                  icon={passwordCopied ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={onCopyPassword}
                  disabled={!generatedPassword}
                />
              </Tooltip>
            </>
          )}
        </Space.Compact>
      </Flex>
    </div>
  );
};

export default TopActionsPanel;