
import { commonTokens, darkComponents } from '../shared';
import { theme } from 'antd';

const gazpromDarkTheme = {
  name: 'Газпром Тёмный',
  mode: 'dark',
  siderTextColor: '#FFFFFF',
  config: {
    algorithm: theme.darkAlgorithm,
    token: {
      ...commonTokens.token,
      colorPrimary: '#0079C1',
      colorPrimaryBg: '#001F2D',
      colorPrimaryBorder: '#004C6E',
      colorPrimaryHover: '#4096FF',
      colorPrimaryActive: '#005A9E',
      colorBgBase: '#141414',
      colorBgContainer: '#1F1F1F',
      colorBgElevated: '#2A2A2A',
      colorBgLayout: '#000000',
      colorTextBase: '#E8E8E8',
      colorTextSecondary: '#A8A8A8',
      colorTextTertiary: '#7A7A7A',
      colorTextDisabled: '#5A5A5A',
      colorBorder: '#333333',
      colorBorderSecondary: '#262626',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.3), 0 3px 6px -4px rgba(0, 0, 0, 0.4), 0 9px 28px 8px rgba(0, 0, 0, 0.2)',
    },
    components: {
      ...darkComponents,
      Layout: {
        ...darkComponents.Layout,
        headerBg: '#1A1A1A',
        siderBg: '#001F2D',
        bodyBg: '#141414',
      },
      Menu: {
        ...darkComponents.Menu,
        itemColor: '#BFBFBF',
        itemHoverBg: '#002B3D',
        itemSelectedBg: '#003F5C',
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

export default gazpromDarkTheme;