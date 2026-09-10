import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  Modal,
  Input,
  Button,
  Switch,
  Space,
  Card,
  Row,
  Col,
  Typography,
  ColorPicker,
  Slider,
  Select,
  Divider,
  message,
  Collapse,
  Tooltip,
  Popconfirm,
  Badge,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  DragOutlined,
  SaveOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UndoOutlined,
  CopyOutlined,
  CheckSquareOutlined,
  MinusSquareOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const { Text, Title } = Typography;
const { Panel } = Collapse;

const ELEMENT_TYPES = [
  {
    type: 'header',
    label: 'Шапка (ООО "Газпром...")',
    defaultEnabled: true,
    icon: '🏢',
  },
  {
    type: 'gramotaType',
    label: 'Тип грамоты (ПОЧЕТНАЯ ГРАМОТА)',
    defaultEnabled: true,
    icon: '🏆',
  },
  {
    type: 'nagr',
    label: 'Заголовок "НАГРАЖДАЕТСЯ"',
    defaultEnabled: true,
    icon: '🎖',
  },
  { type: 'fio', label: 'ФИО сотрудника', defaultEnabled: true, icon: '👤' },
  { type: 'position', label: 'Должность', defaultEnabled: true, icon: '💼' },
  { type: 'text', label: 'Основной текст', defaultEnabled: true, icon: '📝' },
  { type: 'signatures', label: 'Подписи', defaultEnabled: true, icon: '✍️' },
  { type: 'year', label: 'Год', defaultEnabled: true, icon: '📅' },
  {
    type: 'blank',
    label: 'Пустое поле (прочерк)',
    defaultEnabled: false,
    icon: '⬜',
  },
  {
    type: 'team',
    label: 'Команда',
    defaultEnabled: false,
    icon: '👥',
  },
];

const DEFAULT_STYLES = {
  header: {
    fontSize: 13,
    color: '#006ba9',
    fontFamily: 'HeliosCond',
    marginTop: 45,
    marginBottom: 0,
    lineSpacing: 4,
    width: 312,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.4,
    strokeWidth: 0,
    strokeColor: '#006ba9',
  },
  gramotaType: {
    fontSize: 38,
    color: '#006ba9',
    fontFamily: 'HeliosCond-Bold',
    marginTop: 130,
    marginBottom: 0,
    lineSpacing: 0,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 1,
    strokeWidth: 0,
    strokeColor: '#006ba9',
  },
  nagr: {
    fontSize: 24,
    color: '#006ba9',
    fontFamily: 'HeliosCond',
    marginTop: 30,
    marginBottom: 15,
    lineSpacing: 0,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.2,
    strokeWidth: 0,
    strokeColor: '#006ba9',
  },
  fio: {
    fontSize: 36,
    color: '#006ba9',
    fontFamily: 'HeliosCond',
    marginTop: 1,
    marginBottom: 0,
    lineSpacing: 6,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.1,
    strokeWidth: 0,
    strokeColor: '#006ba9',
  },
  position: {
    fontSize: 17,
    color: '#006ba9',
    fontFamily: 'HeliosCond',
    marginTop: 20,
    marginBottom: 0,
    lineSpacing: 0,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.2,
    strokeWidth: 0,
    strokeColor: '#006ba9',
  },
  text: {
    fontSize: 25,
    color: '#006ba9',
    fontFamily: 'HeliosCond',
    lineSpacing: 6,
    marginTop: 20,
    marginBottom: 0,
    width: 485,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.2,
    strokeWidth: 0,
    strokeColor: '#006ba9',
  },
  signatures: {
    fontSize: 14,
    color: '#006ba9',
    fontFamily: 'HeliosCond',
    width: 430,
    marginBottom: 16,
    lineSpacing: 0,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.6,
    strokeWidth: 0,
    strokeColor: '#006ba9',
  },
  year: {
    fontSize: 12,
    color: '#006ba9',
    fontFamily: 'HeliosCond',
    marginTop: 8,
    marginBottom: 0,
    lineSpacing: 0,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1,
    strokeWidth: 0,
    strokeColor: '#006ba9',
  },
  blank: {
    fontSize: 20,
    color: '#999',
    fontFamily: 'HeliosCond',
    marginTop: 20,
    marginBottom: 0,
    lineSpacing: 0,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1,
    strokeWidth: 0,
    strokeColor: '#999',
  },
  team: {
    fontSize: 20,
    color: '#006ba9',
    fontFamily: 'HeliosCond',
    marginTop: 10,
    marginBottom: 0,
    lineSpacing: 0,
    width: 'auto',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1,
    strokeWidth: 0,
    strokeColor: '#006ba9',
  },
};

const FONTS = [
  { value: 'HeliosCond', label: 'HeliosCond' },
  { value: 'HeliosCond-Bold', label: 'HeliosCond-Bold' },
  { value: 'TimesNewRoman', label: 'Times New Roman' },
  { value: 'Arial', label: 'Arial' },
];

let idCounter = 0;
const generateId = () => `el_${Date.now()}_${++idCounter}`;

const createDefaultElement = (type) => {
  const template = ELEMENT_TYPES.find((el) => el.type === type);
  if (!template) return null;
  return {
    id: generateId(),
    type,
    label: template.label,
    icon: template.icon,
    style: { ...DEFAULT_STYLES[type] },
    enabled: template.defaultEnabled,
  };
};

const createDefaultLayout = () => ({
  elements: ELEMENT_TYPES.map((el) => createDefaultElement(el.type)),
});

const deepCloneLayout = (layout) => {
  if (!layout) return null;
  return structuredClone(layout);
};

// ============================================================
// ПРЕДПРОСМОТР
// ============================================================
const TemplatePreview = React.memo(
  ({
    elements,
    backgroundImage,
    previewText,
    approver,
    signer,
    gramotaType,
  }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.4);

    const PT_TO_PX = 96 / 72;
    const PAGE_WIDTH_PT = 595;
    const PAGE_HEIGHT_PT = 842;
    const PAGE_WIDTH_PX = PAGE_WIDTH_PT * PT_TO_PX;
    const PAGE_HEIGHT_PX = PAGE_HEIGHT_PT * PT_TO_PX;

    useEffect(() => {
      if (!containerRef.current) return;

      let timeoutId;
      const updateScale = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const availWidth = Math.max(rect.width - 16, 50);
        const newScale = Math.min(availWidth / PAGE_WIDTH_PX, 2);
        setScale(Math.max(0.1, newScale));
      };

      updateScale();

      const ro = new ResizeObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateScale, 50);
      });

      ro.observe(containerRef.current);

      return () => {
        clearTimeout(timeoutId);
        ro.disconnect();
      };
    }, []);

    const scaledWidth = PAGE_WIDTH_PX * scale;
    const scaledHeight = PAGE_HEIGHT_PX * scale;
    const pt = (val) => (val != null ? val * PT_TO_PX + 'px' : undefined);

    const getElementStyle = (el) => {
      const s = el.style || {};
      return {
        fontSize: pt(s.fontSize ?? 14),
        color: s.color ?? '#006ba9',
        fontFamily: s.fontFamily ?? 'HeliosCond',
        marginTop: pt(s.marginTop ?? 0),
        marginBottom: pt(s.marginBottom ?? 0),
        fontStyle: s.fontStyle ?? 'normal',
        fontWeight: s.fontWeight ?? 'normal',
        lineHeight: s.lineHeight ?? 1,
        textAlign: 'center',
        width: s.width && s.width !== 'auto' ? pt(s.width) : 'auto',
        strokeWidth: s.strokeWidth ?? 0,
        strokeColor: s.strokeColor ?? '#006ba9',
      };
    };

    const applyStroke = (styleObj, s) => {
      const strokeWidth = s.strokeWidth ?? 0;
      const strokeColor = s.strokeColor ?? '#006ba9';
      if (strokeWidth > 0) {
        const px = strokeWidth * PT_TO_PX; // преобразуем pt в px
        return {
          ...styleObj,
          textShadow: `0 0 ${px}px ${strokeColor}`,
          WebkitTextStroke: `${px}px ${strokeColor}`,
        };
      }
      return styleObj;
    };

    const renderLines = (lines, el) => {
      const s = el.style || {};
      const baseStyle = getElementStyle(el);
      const lineGap = pt(s.lineSpacing ?? 0);
      const strokeStyle = applyStroke({}, s);

      return (
        <div style={{ ...baseStyle, marginTop: pt(s.marginTop ?? 0) }}>
          {lines.map((line, i) => {
            const lineStyle = {
              fontSize: baseStyle.fontSize,
              color: baseStyle.color,
              fontFamily: baseStyle.fontFamily,
              fontWeight: baseStyle.fontWeight,
              fontStyle: baseStyle.fontStyle,
              lineHeight: baseStyle.lineHeight,
              textAlign: 'center',
              marginTop: i === 0 ? 0 : lineGap,
              marginBottom: 0,
              display: 'block',
              ...strokeStyle,
            };
            return (
              <div key={i} style={lineStyle}>
                {line}
              </div>
            );
          })}
        </div>
      );
    };

    const renderContent = (el) => {
      const s = el.style || {};
      const style = getElementStyle(el);
      const strokeStyle = applyStroke({}, s);

      switch (el.type) {
        case 'text': {
          const lines = previewText
            ? previewText.split('\n').filter((line) => line.trim() !== '')
            : ['Текст шаблона'];
          return renderLines(lines, el);
        }
        case 'header':
          return renderLines(
            [
              'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ',
              '«ГАЗПРОМ ТРАНСГАЗ УХТА»',
              'ВУКТЫЛЬСКОЕ ЛПУМГ',
            ],
            el
          );
        case 'gramotaType':
          return (
            <div style={{ ...style, ...strokeStyle }}>
              {gramotaType || 'ПОЧЕТНАЯ ГРАМОТА'}
            </div>
          );
        case 'nagr':
          return <div style={{ ...style, ...strokeStyle }}>НАГРАЖДАЕТСЯ</div>;
        case 'fio':
          return renderLines(['ИВАНОВ', 'ИВАН ИВАНОВИЧ'], el);
        case 'position':
          return (
            <div style={{ ...style, ...strokeStyle }}>Начальник отдела</div>
          );
        case 'signatures': {
          const blockWidth =
            s.width && s.width !== 'auto' ? pt(s.width) : pt(430);
          const lineStyle = {
            fontSize: pt(s.fontSize ?? 14),
            color: s.color ?? '#006ba9',
            fontFamily: s.fontFamily ?? 'HeliosCond',
            fontWeight: s.fontWeight ?? 'normal',
            fontStyle: s.fontStyle ?? 'normal',
            lineHeight: s.lineHeight ?? 1.6,
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: pt(s.marginBottom ?? 16),
            ...strokeStyle,
          };
          const signatures = [];
          if (approver?.position && approver?.name) {
            signatures.push({
              position: approver.position,
              name: approver.name,
            });
          }
          if (signer?.position && signer?.name) {
            signatures.push({ position: signer.position, name: signer.name });
          }
          if (signatures.length === 0) {
            signatures.push({ position: 'Должность', name: 'ФИО' });
            signatures.push({ position: 'Должность', name: 'ФИО' });
          }
          return (
            <div
              style={{
                width: blockWidth,
                display: 'flex',
                flexDirection: 'column',
                marginTop: s.marginTop != null ? pt(s.marginTop) : undefined,
              }}
            >
              {signatures.map((person, idx) => (
                <div key={idx} style={lineStyle}>
                  <span>{person.position}</span>
                  <span>{person.name}</span>
                </div>
              ))}
            </div>
          );
        }
        case 'year':
          return (
            <div style={{ ...style, ...strokeStyle }}>
              {new Date().getFullYear()}
            </div>
          );
        case 'blank':
          return (
            <div style={{ ...style, ...strokeStyle }}>_________________</div>
          );
        case 'team':
          return (
            <div style={{ ...style, ...strokeStyle }}>
              Команда _________________
            </div>
          );
        default:
          return null;
      }
    };

    const enabledElements = elements.filter((el) => el.enabled);

    return (
      <div
        ref={containerRef}
        style={{ width: '100%', boxSizing: 'border-box', padding: '8px' }}
      >
        <div
          style={{
            width: scaledWidth + 'px',
            height: scaledHeight + 'px',
            overflow: 'hidden',
            margin: '0 auto',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div
            style={{
              width: PAGE_WIDTH_PX + 'px',
              height: PAGE_HEIGHT_PX + 'px',
              position: 'relative',
              fontFamily: 'HeliosCond, Arial, sans-serif',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {backgroundImage && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
            {backgroundImage && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255,255,255,0.55)',
                  zIndex: 2,
                }}
              />
            )}
            <div
              style={{
                position: 'relative',
                zIndex: 3,
                width: '100%',
                height: '100%',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
              }}
            >
              {enabledElements.length === 0 ? (
                <Empty
                  description="Нет активных элементов"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {enabledElements
                      .filter(
                        (el) => el.type !== 'signatures' && el.type !== 'year'
                      )
                      .map((el) => (
                        <div
                          key={el.id}
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          {renderContent(el)}
                        </div>
                      ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {enabledElements
                      .filter(
                        (el) => el.type === 'signatures' || el.type === 'year'
                      )
                      .map((el) => (
                        <div
                          key={el.id}
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          {renderContent(el)}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// ============================================================
// РЕДАКТОР СТИЛЯ
// ============================================================
const StyleEditor = React.memo(({ element, onUpdate }) => {
  const style = element.style || {};
  const handleNumberChange = (key, rawValue, fallback = 0) => {
    const num = Number(rawValue);
    onUpdate(key, Number.isNaN(num) ? fallback : num);
  };
  return (
    <Collapse size="small" ghost style={{ marginTop: 4 }}>
      <Panel
        header={
          <Text type="secondary" style={{ fontSize: 11 }}>
            ⚙ Настройки стиля
          </Text>
        }
        key="style"
      >
        <Row gutter={[8, 4]}>
          <Col span={12}>
            <Text style={{ fontSize: 10 }}>
              Размер: {style.fontSize ?? 14}pt
            </Text>
            <Slider
              min={8}
              max={110} // увеличен максимум
              value={style.fontSize ?? 14}
              onChange={(val) => onUpdate('fontSize', val)}
            />
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: 10 }}>Цвет</Text>
            <div>
              <ColorPicker
                size="small"
                value={style.color ?? '#006ba9'}
                onChange={(color) => onUpdate('color', color.toHexString())}
              />
              <Text code style={{ marginLeft: 4, fontSize: 10 }}>
                {style.color ?? '#006ba9'}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: 10 }}>Отступ сверху (pt)</Text>
            <Input
              size="small"
              type="number"
              value={style.marginTop ?? 0}
              onChange={(e) =>
                handleNumberChange('marginTop', e.target.value, 0)
              }
            />
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: 10 }}>Отступ снизу (pt)</Text>
            <Input
              size="small"
              type="number"
              value={style.marginBottom ?? 0}
              onChange={(e) =>
                handleNumberChange('marginBottom', e.target.value, 0)
              }
            />
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: 10 }}>Межстрочный (pt)</Text>
            <Input
              size="small"
              type="number"
              step={0.5}
              value={style.lineSpacing ?? 0}
              onChange={(e) => {
                let val = e.target.value.replace(',', '.');
                const num = Number(val);
                if (!isNaN(num)) onUpdate('lineSpacing', num);
              }}
            />
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: 10 }}>Ширина (pt)</Text>
            <Input
              size="small"
              type="number"
              value={
                style.width === 'auto' || style.width == null ? '' : style.width
              }
              placeholder="auto"
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  onUpdate('width', 'auto');
                } else {
                  const num = Number(val);
                  onUpdate('width', isNaN(num) ? 'auto' : num);
                }
              }}
            />
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: 10 }}>Шрифт</Text>
            <Select
              size="small"
              value={style.fontFamily ?? 'HeliosCond'}
              onChange={(val) => onUpdate('fontFamily', val)}
              style={{ width: '100%' }}
              options={FONTS}
            />
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: 10 }}>Начертание</Text>
            <Select
              size="small"
              value={style.fontWeight ?? 'normal'}
              onChange={(val) => onUpdate('fontWeight', val)}
              style={{ width: '100%' }}
              options={[
                { value: 'normal', label: 'Обычный' },
                { value: 'bold', label: 'Жирный' },
                { value: 'italic', label: 'Курсив' },
              ]}
            />
          </Col>
          <Col span={24}>
            <Button
              size="small"
              onClick={() => {
                const defaultStyle = DEFAULT_STYLES[element.type] || {};
                Object.keys(defaultStyle).forEach((key) =>
                  onUpdate(key, defaultStyle[key])
                );
                message.success('Стиль сброшен');
              }}
            >
              Сбросить стиль
            </Button>
          </Col>
          <Col span={24}>
            <Divider style={{ margin: '4px 0' }} />
            <Space>
              <Switch
                checked={style.strokeWidth > 0}
                onChange={(checked) => {
                  onUpdate('strokeWidth', checked ? 1 : 0);
                  if (checked && !style.strokeColor)
                    onUpdate('strokeColor', '#006ba9');
                }}
              />
              <Text style={{ fontSize: 10 }}>Обводка</Text>
            </Space>
          </Col>
          {style.strokeWidth > 0 && (
            <>
              <Col span={12}>
                <Text style={{ fontSize: 10 }}>
                  Толщина: {style.strokeWidth}pt
                </Text>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={style.strokeWidth ?? 1}
                  onChange={(val) => onUpdate('strokeWidth', val)}
                />
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: 10 }}>Цвет</Text>
                <div>
                  <ColorPicker
                    size="small"
                    value={style.strokeColor ?? '#006ba9'}
                    onChange={(color) =>
                      onUpdate('strokeColor', color.toHexString())
                    }
                  />
                  <Text code style={{ marginLeft: 4, fontSize: 10 }}>
                    {style.strokeColor ?? '#006ba9'}
                  </Text>
                </div>
              </Col>
            </>
          )}
        </Row>
      </Panel>
    </Collapse>
  );
});

// ============================================================
// ОСНОВНОЙ КОМПОНЕНТ КОНСТРУКТОРА
// ============================================================
const TemplateBuilder = ({
  visible,
  onClose,
  initialLayout,
  onSave,
  backgroundImage,
  previewText,
  approver,
  signer,
  gramotaType,
}) => {
  const [layout, setLayout] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const initialLayoutRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const initialJson = JSON.stringify(initialLayout);
    if (initialLayoutRef.current === initialJson) return;
    initialLayoutRef.current = initialJson;

    let parsedLayout = initialLayout;
    if (typeof initialLayout === 'string') {
      try {
        parsedLayout = JSON.parse(initialLayout);
      } catch {
        parsedLayout = null;
      }
    }

    if (parsedLayout?.elements?.length) {
      const elementsWithIds = parsedLayout.elements.map((el) => ({
        ...el,
        id: el.id || generateId(),
        style: { ...(DEFAULT_STYLES[el.type] || {}), ...(el.style || {}) },
      }));
      setLayout({ elements: elementsWithIds });
    } else {
      setLayout(createDefaultLayout());
    }
    setIsDirty(false);
  }, [visible, initialLayout]);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const handleDragEnd = useCallback(
    (result) => {
      if (
        !result.destination ||
        result.source.index === result.destination.index
      )
        return;
      setLayout((prev) => {
        const items = Array.from(prev.elements);
        const [reordered] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordered);
        return { ...prev, elements: items };
      });
      markDirty();
    },
    [markDirty]
  );

  const moveElement = useCallback(
    (index, direction) => {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      setLayout((prev) => {
        if (newIndex < 0 || newIndex >= prev.elements.length) return prev;
        const items = Array.from(prev.elements);
        const [moved] = items.splice(index, 1);
        items.splice(newIndex, 0, moved);
        return { ...prev, elements: items };
      });
      markDirty();
    },
    [markDirty]
  );

  const toggleElement = useCallback(
    (index) => {
      setLayout((prev) => {
        const newElements = [...prev.elements];
        newElements[index] = {
          ...newElements[index],
          enabled: !newElements[index].enabled,
        };
        return { ...prev, elements: newElements };
      });
      markDirty();
    },
    [markDirty]
  );

  const toggleAll = useCallback(
    (enabled) => {
      setLayout((prev) => ({
        ...prev,
        elements: prev.elements.map((el) => ({ ...el, enabled })),
      }));
      markDirty();
    },
    [markDirty]
  );

  const updateStyle = useCallback(
    (index, key, value) => {
      setLayout((prev) => {
        const newElements = [...prev.elements];
        newElements[index] = {
          ...newElements[index],
          style: { ...newElements[index].style, [key]: value },
        };
        return { ...prev, elements: newElements };
      });
      markDirty();
    },
    [markDirty]
  );

  const addElement = useCallback(
    (type) => {
      if (layout.elements.some((el) => el.type === type)) {
        Modal.warning({
          title: 'Элемент уже существует',
          content:
            'Вы можете дублировать его через кнопку "Дублировать" в карточке.',
        });
        return;
      }
      const newEl = createDefaultElement(type);
      if (!newEl) return;
      setLayout((prev) => ({ ...prev, elements: [...prev.elements, newEl] }));
      markDirty();
    },
    [layout, markDirty]
  );

  const duplicateElement = useCallback(
    (index) => {
      setLayout((prev) => {
        const source = prev.elements[index];
        const copy = {
          ...deepCloneLayout({ elements: [source] }).elements[0],
          id: generateId(),
          label: `${source.label} (копия)`,
        };
        const newElements = [...prev.elements];
        newElements.splice(index + 1, 0, copy);
        return { ...prev, elements: newElements };
      });
      markDirty();
    },
    [markDirty]
  );

  const removeElement = useCallback(
    (index) => {
      setLayout((prev) => {
        const newElements = [...prev.elements];
        newElements.splice(index, 1);
        return { ...prev, elements: newElements };
      });
      markDirty();
    },
    [markDirty]
  );

  const resetToDefaults = useCallback(() => {
    setLayout(createDefaultLayout());
    markDirty();
    message.info('Макет сброшен');
  }, [markDirty]);

  const handleSave = useCallback(() => {
    if (!layout?.elements?.length) {
      message.error('Макет пуст');
      return;
    }
    const enabledCount = layout.elements.filter((e) => e.enabled).length;
    if (enabledCount === 0) {
      message.warning('Включите хотя бы один элемент');
      return;
    }
    onSave?.(layout);
    setIsDirty(false);
    onClose?.();
    message.success('Макет сохранён');
  }, [layout, onSave, onClose]);

  const handleClose = useCallback(() => onClose?.(), [onClose]);

  const confirmClose = useCallback(() => {
    if (isDirty) {
      Modal.confirm({
        title: 'Есть несохранённые изменения',
        icon: <ExclamationCircleOutlined />,
        content: 'Все изменения будут потеряны. Закрыть конструктор?',
        okText: 'Закрыть без сохранения',
        cancelText: 'Продолжить',
        onOk: handleClose,
      });
    } else handleClose();
  }, [isDirty, handleClose]);

  const enabledCount = useMemo(
    () => layout?.elements?.filter((e) => e.enabled).length ?? 0,
    [layout]
  );

  return (
    <Modal
      title={
        <Space>
          <span>Конструктор шаблона</span>
          {isDirty && (
            <Badge
              status="processing"
              text={<Text type="warning">Есть изменения</Text>}
            />
          )}
        </Space>
      }
      open={visible}
      onCancel={confirmClose}
      width="95%"
      style={{ maxWidth: 1500, top: 20 }}
      destroyOnClose
      footer={[
        <Button key="reset" icon={<UndoOutlined />} onClick={resetToDefaults}>
          Сбросить
        </Button>,
        <Button key="cancel" onClick={confirmClose}>
          {isDirty ? 'Отмена' : 'Закрыть'}
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
        >
          Сохранить макет
        </Button>,
      ]}
      styles={{
        body: {
          padding: '16px 24px',
          height: '80vh',
          overflow: 'hidden',
        },
      }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Row
          gutter={[16, 0]}
          style={{ flex: 1, height: '100%', flexWrap: 'nowrap' }}
        >
          {/* Левая колонка: список доступных элементов */}
          <Col xs={24} md={6} lg={5} xl={4} style={{ height: '100%' }}>
            <div style={{ position: 'sticky', top: 0 }}>
              <Title level={5} style={{ marginBottom: 8 }}>
                Добавить элемент
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ELEMENT_TYPES.map((el) => (
                  <Button
                    key={el.type}
                    size="small"
                    block
                    onClick={() => addElement(el.type)}
                    icon={<PlusOutlined />}
                    style={{ textAlign: 'left', paddingLeft: 8, fontSize: 12 }}
                  >
                    <span style={{ fontSize: 14, marginRight: 4 }}>
                      {el.icon}
                    </span>
                    {el.label.split(' (')[0]}
                  </Button>
                ))}
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <Text type="secondary" style={{ fontSize: 11 }}>
                Нажмите на элемент, чтобы добавить его в макет.
              </Text>
            </div>
          </Col>

          {/* Центральная колонка: порядок и видимость */}
          <Col
            xs={24}
            md={10}
            lg={10}
            xl={11}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ marginBottom: 8, flexShrink: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Title level={5} style={{ margin: 0 }}>
                  Порядок и видимость
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, marginLeft: 6 }}
                  >
                    ({enabledCount}/{layout?.elements?.length ?? 0})
                  </Text>
                </Title>
                <Space size={2}>
                  <Tooltip title="Включить все">
                    <Button
                      size="small"
                      icon={<CheckSquareOutlined />}
                      onClick={() => toggleAll(true)}
                    />
                  </Tooltip>
                  <Tooltip title="Выключить все">
                    <Button
                      size="small"
                      icon={<MinusSquareOutlined />}
                      onClick={() => toggleAll(false)}
                    />
                  </Tooltip>
                </Space>
              </div>
              <div style={{ color: '#888', fontSize: 11 }}>
                <DragOutlined /> Перетаскивайте блоки или используйте ↑↓
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                paddingRight: 4,
                minHeight: 0,
              }}
            >
              {layout?.elements?.length ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="elements">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          backgroundColor: snapshot.isDraggingOver
                            ? '#e6f7ff'
                            : 'transparent',
                          transition: 'background 0.2s',
                          minHeight: 60,
                          padding: 2,
                          borderRadius: 4,
                        }}
                      >
                        {layout.elements.map((el, index) => (
                          <Draggable
                            key={el.id}
                            draggableId={el.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                size="small"
                                bodyStyle={{ padding: '6px 8px' }}
                                style={{
                                  marginBottom: 4,
                                  border: el.enabled
                                    ? '1px solid #d9d9d9'
                                    : '1px dashed #ffccc7',
                                  backgroundColor: el.enabled
                                    ? '#fff'
                                    : '#fafafa',
                                  opacity: el.enabled ? 1 : 0.7,
                                  transition: 'all 0.2s',
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                >
                                  <span
                                    {...provided.dragHandleProps}
                                    style={{
                                      cursor: 'grab',
                                      color: '#999',
                                      fontSize: 14,
                                    }}
                                  >
                                    <DragOutlined />
                                  </span>
                                  <Tooltip
                                    title={el.enabled ? 'Скрыть' : 'Показать'}
                                  >
                                    <Switch
                                      checked={el.enabled}
                                      onChange={() => toggleElement(index)}
                                      size="small"
                                    />
                                  </Tooltip>
                                  <Text
                                    strong
                                    style={{
                                      flex: 1,
                                      fontSize: 12,
                                      marginLeft: 4,
                                    }}
                                    ellipsis
                                  >
                                    <span style={{ marginRight: 4 }}>
                                      {el.icon}
                                    </span>
                                    {el.label}
                                  </Text>
                                  <Space size={0}>
                                    <Button
                                      size="small"
                                      type="text"
                                      icon={<ArrowUpOutlined />}
                                      disabled={index === 0}
                                      onClick={() => moveElement(index, 'up')}
                                    />
                                    <Button
                                      size="small"
                                      type="text"
                                      icon={<ArrowDownOutlined />}
                                      disabled={
                                        index === layout.elements.length - 1
                                      }
                                      onClick={() => moveElement(index, 'down')}
                                    />
                                    <Button
                                      size="small"
                                      type="text"
                                      icon={<CopyOutlined />}
                                      onClick={() => duplicateElement(index)}
                                    />
                                    <Popconfirm
                                      title="Удалить?"
                                      onConfirm={() => removeElement(index)}
                                      okText="Да"
                                      cancelText="Нет"
                                    >
                                      <Button
                                        size="small"
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                      />
                                    </Popconfirm>
                                  </Space>
                                </div>
                                {el.enabled && (
                                  <StyleEditor
                                    element={el}
                                    onUpdate={(key, value) =>
                                      updateStyle(index, key, value)
                                    }
                                  />
                                )}
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <Empty
                  description="Добавьте элементы из левой панели"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          </Col>

          {/* Правая колонка: предпросмотр */}
          <Col xs={24} md={8} lg={9} xl={9} style={{ height: '100%' }}>
            <Title level={5} style={{ marginBottom: 8 }}>
              Предпросмотр
            </Title>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100% - 40px)',
              }}
            >
              <Card
                bodyStyle={{ padding: 8, backgroundColor: '#f0f0f0', flex: 1 }}
              >
                <TemplatePreview
                  elements={layout?.elements || []}
                  backgroundImage={backgroundImage}
                  previewText={previewText}
                  approver={approver}
                  signer={signer}
                  gramotaType={gramotaType}
                />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default TemplateBuilder;
