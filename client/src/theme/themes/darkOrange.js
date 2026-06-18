// src/theme/themes/darkOrange.js
import { theme } from 'antd';
import { commonTokens, darkComponents } from '../shared';

// Объект темы: содержит метаданные и конфигурацию для Ant Design ConfigProvider
const darkOrangeTheme = {
  // Отображаемое имя темы в переключателе (UI)
  name: 'Тёмная оранжевая',

  // Режим темы: 'light' или 'dark'
  // Влияет на выбор алгоритма (defaultAlgorithm/darkAlgorithm) и добавление класса на body
  mode: 'dark',

  // Цвет текста и иконок в сайдбаре (специальное поле для LogoSection, UserInfoSection)
  // Позволяет задать контрастный цвет на тёмном/светлом фоне сайдбара независимо от глобального colorTextBase
  siderTextColor: '#E8E8E8',

  // Конфигурация, передаваемая напрямую в ConfigProvider (поле theme)
  config: {
    // Алгоритм построения темы: theme.defaultAlgorithm – светлая, theme.darkAlgorithm – тёмная
    algorithm: theme.darkAlgorithm,

    // Глобальные токены (Design Token) – влияют на все компоненты Ant Design
    token: {
      // Базовые токены из shared.commonTokens (скругления, размеры шрифтов)
      ...commonTokens.token,

      // Основной цвет бренда – используется для активных кнопок, ссылок, выделенных элементов
      colorPrimary: '#fa922f',
      // Фон для элементов с основным цветом (например, активная вкладка)
      colorPrimaryBg: '#2D2D2D',
      // Цвет границы для элементов в фокусе / активном состоянии
      colorPrimaryBorder: '#fa922f',
      // Цвет основного элемента при наведении мыши
      colorPrimaryHover: '#fbae5e',
      // Цвет основного элемента при нажатии (active)
      colorPrimaryActive: '#e07a1a',

      // Базовый фон страницы (самый глубокий уровень)
      colorBgBase: '#141923',
      // Фон контейнеров (карточек, модальных окон, вкладок)
      colorBgContainer: '#1E2432',
      // Фон всплывающих элементов (dropdown, tooltip, popover)
      colorBgElevated: '#252C3D',
      // Фон областей макета (фон вокруг сайдбара)
      colorBgLayout: '#0F131C',

      // Основной цвет текста (наследуется большинством компонентов)
      colorTextBase: '#E8E8E8',
      // Второстепенный текст (подписи, дополнительная информация)
      colorTextSecondary: '#A8A8A8',
      // Текст-подсказка, плейсхолдеры
      colorTextTertiary: '#7A7A7A',
      // Цвет отключённого текста
      colorTextDisabled: '#5A5A5A',

      // Цвет основных границ (поля ввода, таблицы)
      colorBorder: '#2C3345',
      // Цвет второстепенных границ (разделители в меню)
      colorBorderSecondary: '#222838',

      // Лёгкая тень для карточек и некрупных элементов
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      // Глубокая тень для всплывающих окон (модалки, дропдауны)
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.3), 0 3px 6px -4px rgba(0, 0, 0, 0.4), 0 9px 28px 8px rgba(0, 0, 0, 0.2)',
    },

    // Настройки для конкретных компонентов Ant Design (переопределяют глобальные токены)
    components: darkComponents,
    // darkComponents включает в себя настройки для Layout, Menu, Button, Table, Card, Modal, Input, Select
    // Например:
    // - Layout.siderBg: градиентный фон сайдбара
    // - Menu.itemHoverBg: фон пункта меню при наведении
    // - Table.rowHoverBg: фон строки таблицы при наведении
    // - и т.д.
  },
};

export default darkOrangeTheme;