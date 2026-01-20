// src/features/security-training/utils/iconUtils.js
import {
  SecurityScanOutlined,
  SafetyOutlined,
  FireOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';

export const getIconByType = (iconType) => {
  const iconMap = {
    SecurityScanOutlined: <SecurityScanOutlined />,
    SafetyOutlined: <SafetyOutlined />,
    FireOutlined: <FireOutlined />,
    MedicineBoxOutlined: <MedicineBoxOutlined />,
  };

  return iconMap[iconType] || <SecurityScanOutlined />;
};