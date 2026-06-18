
import { commonTokens, lightComponents } from '../shared';
import { theme } from 'antd';

const defaultTheme = {
  name: 'Светлая синяя',
  mode: 'light',
  siderTextColor: '#1F1F1F',
  config: {
    algorithm: theme.defaultAlgorithm,
    token: {
      ...commonTokens.token,
      colorPrimary: '#1677FF',
      colorPrimaryBg: '#E6F4FF',
      colorPrimaryBorder: '#91CAFF',
      colorPrimaryHover: '#4096FF',
      colorPrimaryActive: '#0958D9',
      colorBgBase: '#FFFFFF',
      colorBgContainer: '#FFFFFF',
      colorBgElevated: '#FFFFFF',
      colorBgLayout: '#F5F5F5',
      colorTextBase: '#1F1F1F',
      colorTextSecondary: '#6B6B6B',
      colorTextTertiary: '#8C8C8C',
      colorTextDisabled: '#BFBFBF',
      colorBorder: '#E8E8E8',
      colorBorderSecondary: '#F0F0F0',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    },
    components: {
      ...lightComponents,
      // При необходимости можно переопределить компоненты
    },
  },
};
export default defaultTheme;