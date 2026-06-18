
import { commonTokens, lightComponents } from '../shared';
import { theme } from 'antd';

const gazpromClassicTheme = {
  name: 'Газпром Классический',
  mode: 'light',
  siderTextColor: '#FFFFFF',
  config: {
    algorithm: theme.defaultAlgorithm,
    token: {
      ...commonTokens.token,
      colorPrimary: '#0079C1',
      colorPrimaryBg: '#E6F5FF',
      colorPrimaryBorder: '#B3E0FF',
      colorPrimaryHover: '#4096FF',
      colorPrimaryActive: '#005A9E',
      colorBgBase: '#FFFFFF',
      colorBgContainer: '#FFFFFF',
      colorBgElevated: '#FFFFFF',
      colorBgLayout: '#F0F2F5',
      colorTextBase: '#1F1F1F',
      colorTextSecondary: '#6B6B6B',
      colorTextTertiary: '#8C8C8C',
      colorTextDisabled: '#BFBFBF',
      colorBorder: '#D9D9D9',
      colorBorderSecondary: '#F0F0F0',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    },
    components: {
      ...lightComponents,
      Layout: {
        ...lightComponents.Layout,
        siderBg: '#001F2D',
      },
      Menu: {
        ...lightComponents.Menu,
        itemColor: '#D9E6F2',
        itemHoverBg: '#004C6E',
        itemSelectedBg: '#005A9E',
        itemSelectedColor: '#FFFFFF',
      },
      Tabs: { inkBarColor: '#0079C1', itemActiveColor: '#0079C1', itemSelectedColor: '#0079C1' },
      Pagination: { colorPrimary: '#0079C1' },
      Switch: { colorPrimary: '#0079C1' },
      Checkbox: { colorPrimary: '#0079C1' },
      Radio: { colorPrimary: '#0079C1' },
    },
  },
};

export default gazpromClassicTheme;