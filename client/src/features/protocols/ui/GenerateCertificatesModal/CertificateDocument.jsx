// src/features/protocols/ui/GenerateCertificatesModal/CertificateDocument.jsx
import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

Font.register({
  family: 'TimesNewRoman',
  src: '/fonts/TNR/times.ttf',
});
Font.register({
  family: 'TimesNewRoman-Bold',
  src: '/fonts/TNR/timesbd.ttf',
});

const MM = 2.83465;

const CARD_WIDTH_MM = 95;
const CARD_HEIGHT_MM = 72;
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const COLS = 2;
const ROWS = 3;

const CARD_WIDTH = CARD_WIDTH_MM * MM;
const CARD_HEIGHT = CARD_HEIGHT_MM * MM;
const PAGE_WIDTH = PAGE_WIDTH_MM * MM;
const PAGE_HEIGHT = PAGE_HEIGHT_MM * MM;

// Отступы между карточками и краями страницы
const PADDING_HORIZONTAL = (PAGE_WIDTH - COLS * CARD_WIDTH) / (COLS + 1);
const PADDING_VERTICAL = (PAGE_HEIGHT - ROWS * CARD_HEIGHT) / (ROWS + 1);

// Корректировка для оборотной стороны (смещение для двусторонней печати)
// Если карточки смещаются влево и вверх, задайте положительные значения (3 мм)
// Если вправо и вниз — отрицательные
const OFFSET_X_MM = 2; // смещение по горизонтали в мм
const OFFSET_Y_MM = -2; // смещение по вертикали в мм
const OFFSET_X = OFFSET_X_MM * MM;
const OFFSET_Y = OFFSET_Y_MM * MM;

const CARD_BG = '#CCFFFF';

const formatDateToRussian = (dateStr) => {
  if (!dateStr) return '__ ________ ____ г.';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
    ];
    return `${day} ${monthNames[month - 1]} ${year} г.`;
  } catch {
    return dateStr;
  }
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: '#ffffff',
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  // Контейнер для лицевой стороны (без смещения)
  container: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  // Контейнер для оборотной стороны (со смещением)
  containerBack: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    transform: `translateX(${OFFSET_X}pt) translateY(${OFFSET_Y}pt)`,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    border: '1px solid #000',
    padding: 3 * MM,
    fontSize: 6.5 * MM,
    fontFamily: 'TimesNewRoman',
    overflow: 'hidden',
    backgroundColor: CARD_BG,
  },
  cardEmpty: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    border: 'none',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 4 * MM,
    textAlign: 'center',
    fontFamily: 'TimesNewRoman',
    marginTop: 9 * MM,
    marginBottom: 1 * MM,
  },
  subtitle: {
    fontSize: 4 * MM,
    textAlign: 'center',
    fontFamily: 'TimesNewRoman',
    marginBottom: 1 * MM,
  },
  subtitle2: {
    fontSize: 4 * MM,
    textAlign: 'center',
    fontFamily: 'TimesNewRoman',
    marginTop: 9 * MM,
    marginBottom: 1 * MM,
  },
  subtitle3: {
    fontSize: 4 * MM,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5 * MM,
    fontFamily: 'TimesNewRoman-Bold',
    marginBottom: 1 * MM,
  },
  orgName: {
    fontSize: 6 * MM,
    textAlign: 'center',
    fontFamily: 'TimesNewRoman',
    marginBottom: 1 * MM,
  },
  field: {
    fontSize: 3 * MM,
    marginBottom: 0.3 * MM,
    fontWeight: 'bold',
    fontFamily: 'TimesNewRoman-Bold',
  },
  field2: {
    fontSize: 2.4 * MM,
    marginTop: 0.3 * MM,
    marginBottom: 0.3 * MM,
    fontFamily: 'TimesNewRoman',
    textAlign: 'justify',
  },
  label: {
    fontFamily: 'TimesNewRoman',
  },
  backTitle: {
    fontSize: 4 * MM,
    textAlign: 'center',
    fontFamily: 'TimesNewRoman',
    marginBottom: 1 * MM,
  },
  stamp: {
    marginTop: 1 * MM,
    textAlign: 'left',
    fontSize: 3 * MM,
  },
  emptyMessage: {
    fontSize: 14 * MM,
    textAlign: 'center',
    marginTop: 100 * MM,
    fontFamily: 'TimesNewRoman',
  },
});

const CardFront = ({ worker, protocol }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>УДОСТОВЕРЕНИЕ</Text>
      <Text style={styles.subtitle}>О ПРОВЕРКЕ ЗНАНИЙ ТРЕБОВАНИЙ</Text>
      <Text style={styles.subtitle}>ОХРАНЫ ТРУДА</Text>
      <Text style={styles.subtitle2}>
        Общество с ограниченной ответственностью
      </Text>
      <Text style={styles.subtitle3}>«ГАЗПРОМ ТРАНСГАЗ УХТА»</Text>
    </View>
  );
};

const CardBack = ({ worker, protocol }) => {
  const formattedDate = formatDateToRussian(protocol.date);
  return (
    <View style={styles.card}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.backTitle}>
            УДОСТОВЕРЕНИЕ №{worker.certificateNumber}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Выдано: </Text>
            {worker.fullName}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Место работы: </Text>
            {protocol.organization}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Должность: </Text>
            {worker.profession}, {worker.workplace}
          </Text>
          <Text style={styles.field2}>
            <Text style={styles.label}>
              Проведена проверка знаний требований охраны труда по программе{' '}
              {protocol.programName} {formattedDate} в объеме{' '}
              {protocol.programDuration} часов.
            </Text>
          </Text>
        </View>

        <View>
          <Text style={styles.field2}>
            <Text style={styles.label}>
              Протокол заседания комиссии (Экзаменационная комиссия (ЭК) для
              проведения проверки знаний требований охраны труда у руководителей
              и специалистов) от {formattedDate} № {protocol.number}
            </Text>
          </Text>

          <View style={{ marginTop: 1 * MM }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.field2}>Председатель комиссии:</Text>
              <Text style={styles.field}>
                _______________ {protocol.commission?.chairman?.name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ fontSize: 2.5 * MM, fontFamily: 'TimesNewRoman' }}>
                (подпись)
              </Text>
            </View>
            <View style={styles.stamp}>
              <Text>{formattedDate}</Text>
              <Text style={styles.field2}>М.П.</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const CertificateDocument = ({ data }) => {
  const allItems = [];
  data.forEach(({ protocol, workers }) => {
    workers.forEach((w) => {
      allItems.push({ worker: w, protocol });
    });
  });

  if (allItems.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.emptyMessage}>Нет данных для отображения</Text>
        </Page>
      </Document>
    );
  }

  const groups = [];
  for (let i = 0; i < allItems.length; i += 6) {
    groups.push(allItems.slice(i, i + 6));
  }

  return (
    <Document>
      {groups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {/* Лицевая сторона группы */}
          <Page size="A4" style={styles.page}>
            <View style={styles.container}>
              {Array.from({ length: ROWS }).map((_, rowIndex) => {
                const start = rowIndex * COLS;
                const rowItems = group.slice(start, start + COLS);
                return (
                  <View key={rowIndex} style={styles.row}>
                    {rowItems.map((item, colIndex) => (
                      <CardFront
                        key={`front-${rowIndex}-${colIndex}`}
                        worker={item.worker}
                        protocol={item.protocol}
                      />
                    ))}
                    {rowItems.length < COLS &&
                      Array.from({ length: COLS - rowItems.length }).map(
                        (_, emptyIndex) => (
                          <View
                            key={`empty-${rowIndex}-${emptyIndex}`}
                            style={styles.cardEmpty}
                          />
                        )
                      )}
                  </View>
                );
              })}
            </View>
          </Page>

          {/* Оборотная сторона группы (со смещением) */}
          <Page size="A4" style={styles.page}>
            <View style={styles.containerBack}>
              {Array.from({ length: ROWS }).map((_, rowIndex) => {
                const start = rowIndex * COLS;
                const rowItems = group.slice(start, start + COLS);
                return (
                  <View key={rowIndex} style={styles.row}>
                    {rowItems.map((item, colIndex) => (
                      <CardBack
                        key={`back-${rowIndex}-${colIndex}`}
                        worker={item.worker}
                        protocol={item.protocol}
                      />
                    ))}
                    {rowItems.length < COLS &&
                      Array.from({ length: COLS - rowItems.length }).map(
                        (_, emptyIndex) => (
                          <View
                            key={`empty-back-${rowIndex}-${emptyIndex}`}
                            style={styles.cardEmpty}
                          />
                        )
                      )}
                  </View>
                );
              })}
            </View>
          </Page>
        </React.Fragment>
      ))}
    </Document>
  );
};

export default CertificateDocument;