import { Button, Flex, Tooltip, Switch, Input, Space, Badge, theme } from "antd";
import { PlusOutlined, ImportOutlined, ExportOutlined, SettingOutlined, ReloadOutlined, CopyOutlined, CheckOutlined, EyeOutlined, EyeInvisibleOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import styles from "./TopActionsPanel.module.css";

const { useToken } = theme;

const TopActionsPanel = ({ onCreate, onImport, onExport, onSprav, onToggleDeleted, onToggleNoPhoto, showDeleted, showNoPhoto, exportLoading, generatedPassword, onGeneratePassword, onCopyPassword, passwordCopied, showPasswordField, noPhotoCount = 0, onClearSearch = () => {} }) => {
  const { token } = useToken();
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleDeleted = (checked) => { onToggleDeleted(checked); onClearSearch(); };
  const handleToggleNoPhoto = (checked) => { onToggleNoPhoto(checked); onClearSearch(); };

  return (
    <div className={styles.topPanel}>
      <Flex gap="small" align="center" wrap="wrap">
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Создать</Button>
        <Button type="primary" icon={<ImportOutlined />} onClick={onImport}>Импорт</Button>
        <Button type="primary" icon={<ExportOutlined />} onClick={onExport} loading={exportLoading}>Экспорт</Button>
        <Button type="primary" icon={<SettingOutlined />} onClick={onSprav}>Справочник</Button>

        <Tooltip title={showDeleted ? "Скрыть уволенных" : "Показать уволенных"}>
          <div className={styles.toggleContainer} style={{ background: token.colorBgLayout, borderColor: token.colorBorder }}>
            <Switch checked={showDeleted} onChange={handleToggleDeleted} checkedChildren={<EyeOutlined />} unCheckedChildren={<EyeInvisibleOutlined />} size="small" />
            <span className={styles.toggleLabel} style={{ color: token.colorTextSecondary }}>{showDeleted ? "Уволенные" : "Только активные"}</span>
          </div>
        </Tooltip>

        <Tooltip title={showNoPhoto ? "Показать всех" : "Показать только без фото"}>
          <div className={styles.toggleContainer} style={{ background: token.colorBgLayout, borderColor: token.colorBorder }}>
            <Badge count={showNoPhoto ? 0 : noPhotoCount} size="small" offset={[5, -5]}>
              <Switch checked={showNoPhoto} onChange={handleToggleNoPhoto} checkedChildren={<UserOutlined />} unCheckedChildren={<UserOutlined />} size="small" />
            </Badge>
            <span className={styles.toggleLabel} style={{ color: token.colorTextSecondary }}>{showNoPhoto ? "Без фото" : "Все"}</span>
          </div>
        </Tooltip>

        <Space.Compact>
          <Button type="primary" icon={<ReloadOutlined />} onClick={onGeneratePassword} style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>Пароль</Button>
          {showPasswordField && (
            <>
              <Input value={generatedPassword || ""} placeholder="Сгенерированный пароль" readOnly style={{ width: 180 }} type={showPassword ? "text" : "password"} />
              <Tooltip title={showPassword ? "Скрыть пароль" : "Показать пароль"}>
                <Button icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => setShowPassword(!showPassword)} />
              </Tooltip>
              <Tooltip title={passwordCopied ? "Скопировано!" : "Копировать в буфер"}>
                <Button icon={passwordCopied ? <CheckOutlined /> : <CopyOutlined />} onClick={onCopyPassword} disabled={!generatedPassword} />
              </Tooltip>
            </>
          )}
        </Space.Compact>
      </Flex>
    </div>
  );
};

export default TopActionsPanel;