import React, { useMemo } from 'react';
import { Document, Page, View, Text, Image, Font } from '@react-pdf/renderer';
import { baseStyles } from '../config/pdfStyles';
import {
  parseLayout,
  replaceVariables,
  getElementStyle,
} from '../utils/pdfUtils';

Font.register({
  family: 'HeliosCond',
  src: '/fonts/HeliosCond/HeliosCond_Regular.otf',
});
Font.register({
  family: 'HeliosCond-Bold',
  src: '/fonts/HeliosCond/helioscond_bold.otf',
});

const renderTextWithStroke = (
  lines,
  style,
  lineSpacing,
  marginTop,
  marginBottom,
  width
) => {
  const hasStroke = Number(style.strokeWidth) > 0 && style.strokeColor;
  const color = style.color || '#000';
  const strokeColor = style.strokeColor || '#000';
  const strokeOffset = Number(style.strokeWidth) || 1;

  const textBase = {
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    lineHeight: style.lineHeight,
    textAlign: 'center',
  };

  const directions = hasStroke
    ? [
        { top: -strokeOffset, left: 0 },
        { top: strokeOffset, left: 0 },
        { top: 0, left: -strokeOffset },
        { top: 0, left: strokeOffset },
        { top: -strokeOffset, left: -strokeOffset },
        { top: -strokeOffset, left: strokeOffset },
        { top: strokeOffset, left: -strokeOffset },
        { top: strokeOffset, left: strokeOffset },
      ]
    : [];

  return (
    <View
      style={{
        marginTop,
        marginBottom,
        width: width && width !== 'auto' ? width : undefined,
        alignItems: 'center',
      }}
    >
      {lines.map((line, i) => {
        const mt = i === 0 ? 0 : lineSpacing;

        if (hasStroke) {
          return (
            <View
              key={i}
              style={{
                position: 'relative',
                width: '100%',
                alignItems: 'center',
                marginTop: mt,
                marginBottom: 0,
              }}
            >
              {directions.map((dir, idx) => (
                <Text
                  key={idx}
                  style={{
                    ...textBase,
                    color: strokeColor,
                    position: 'absolute',
                    top: dir.top,
                    left: 0,
                    right: 0,
                  }}
                >
                  {line}
                </Text>
              ))}
              <Text
                style={{
                  ...textBase,
                  color: color,
                  position: 'relative',
                }}
              >
                {line}
              </Text>
            </View>
          );
        }

        return (
          <Text
            key={i}
            style={{
              ...textBase,
              color: color,
              marginTop: mt,
              marginBottom: 0,
            }}
          >
            {line}
          </Text>
        );
      })}
    </View>
  );
};

const renderSignatures = (style, approver, signer) => {
  if (!style) return null;
  const { marginTop = 0, marginBottom = 16, width = 430, ...rest } = style;

  const rows = [];
  if (approver?.position && approver?.name)
    rows.push({ pos: approver.position, name: approver.name });
  if (signer?.position && signer?.name)
    rows.push({ pos: signer.position, name: signer.name });
  if (rows.length === 0) return null;

  const hasStroke = Number(rest.strokeWidth) > 0 && rest.strokeColor;
  const color = rest.color || '#000';
  const strokeColor = rest.strokeColor || '#000';
  const strokeOffset = Number(rest.strokeWidth) || 1;

  const textBase = {
    fontSize: rest.fontSize,
    fontFamily: rest.fontFamily,
    fontWeight: rest.fontWeight,
    fontStyle: rest.fontStyle,
    lineHeight: rest.lineHeight,
  };

  const directions = hasStroke
    ? [
        { top: -strokeOffset, left: 0 },
        { top: strokeOffset, left: 0 },
        { top: 0, left: -strokeOffset },
        { top: 0, left: strokeOffset },
        { top: -strokeOffset, left: -strokeOffset },
        { top: -strokeOffset, left: strokeOffset },
        { top: strokeOffset, left: -strokeOffset },
        { top: strokeOffset, left: strokeOffset },
      ]
    : [];

  return (
    <View
      style={{
        marginTop,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {rows.map((row, i) => {
        const rowMb = i === rows.length - 1 ? 0 : marginBottom;

        if (hasStroke) {
          return (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width,
                marginBottom: rowMb,
              }}
            >
              <View style={{ position: 'relative', flex: 1 }}>
                {directions.map((dir, idx) => (
                  <Text
                    key={`pos-stroke-${idx}`}
                    style={{
                      ...textBase,
                      color: strokeColor,
                      position: 'absolute',
                      top: dir.top,
                      left: 0,
                      right: 0,
                      textAlign: 'left',
                    }}
                  >
                    {row.pos}
                  </Text>
                ))}
                <Text
                  style={{
                    ...textBase,
                    color,
                    position: 'relative',
                    textAlign: 'left',
                  }}
                >
                  {row.pos}
                </Text>
              </View>
              <View style={{ position: 'relative', flex: 1 }}>
                {directions.map((dir, idx) => (
                  <Text
                    key={`name-stroke-${idx}`}
                    style={{
                      ...textBase,
                      color: strokeColor,
                      position: 'absolute',
                      top: dir.top,
                      left: 0,
                      right: 0,
                      textAlign: 'right',
                    }}
                  >
                    {row.name}
                  </Text>
                ))}
                <Text
                  style={{
                    ...textBase,
                    color,
                    position: 'relative',
                    textAlign: 'right',
                  }}
                >
                  {row.name}
                </Text>
              </View>
            </View>
          );
        }

        return (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width,
              marginBottom: rowMb,
            }}
          >
            <Text style={{ ...textBase, color, textAlign: 'left' }}>
              {row.pos}
            </Text>
            <Text style={{ ...textBase, color, textAlign: 'right' }}>
              {row.name}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const renderBlock = (lines, style, approver, signer) => {
  if (!style) return null;
  const {
    lineSpacing = 0,
    marginTop = 0,
    marginBottom = 0,
    width,
    ...rest
  } = style;
  const filtered = lines.filter((l) => l && l.trim() !== '');
  if (filtered.length === 0) return null;

  // Если это блок подписей — используем специальный рендер
  if (style === signer?.style || style === approver?.style) {
    // Проверка по типу (упрощённо: проверяем наличие полей)
    if (rest.fontSize === 14 && rest.width === 430) {
      return renderSignatures(style, approver, signer);
    }
  }

  return renderTextWithStroke(
    filtered,
    rest,
    lineSpacing,
    marginTop,
    marginBottom,
    width
  );
};

const GramotaPDFDocument = ({
  staffList,
  backgroundImage,
  textTemplate,
  approver,
  signer,
  gramotaType = 'ПОЧЕТНАЯ ГРАМОТА',
  layout = null,
}) => {
  const parsedLayout = useMemo(() => parseLayout(layout), [layout]);

  return (
    <Document>
      {staffList.map((staff, index) => {
        const headerLines = [
          'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ',
          '«ГАЗПРОМ ТРАНСГАЗ УХТА»',
          'ВУКТЫЛЬСКОЕ ЛПУМГ',
        ];
        const teamStyle = getElementStyle(
          parsedLayout,
          'team',
          baseStyles.team
        );
        const fioParts = (staff.fio || '').split(' ');
        const lastName = fioParts[0] || '';
        const firstName = fioParts[1] || '';
        const middleName = fioParts[2] || '';
        const fullName = firstName + (middleName ? ' ' + middleName : '');
        const fioLines = [lastName, fullName].filter(Boolean);

        const processedText = replaceVariables(textTemplate, staff);
        const textLines = processedText
          .split('\n')
          .filter((line) => line.trim() !== '');

        const headerStyle = getElementStyle(
          parsedLayout,
          'header',
          baseStyles.header
        );
        const gramotaTypeStyle = getElementStyle(
          parsedLayout,
          'gramotaType',
          baseStyles.gramotaType
        );
        const nagrStyle = getElementStyle(
          parsedLayout,
          'nagr',
          baseStyles.nagr
        );
        const fioStyle = getElementStyle(parsedLayout, 'fio', baseStyles.fio);
        const positionStyle = getElementStyle(
          parsedLayout,
          'position',
          baseStyles.position
        );
        const textStyle = getElementStyle(
          parsedLayout,
          'text',
          baseStyles.text
        );
        const signaturesStyle = getElementStyle(
          parsedLayout,
          'signatures',
          baseStyles.signatures
        );
        const yearStyle = getElementStyle(
          parsedLayout,
          'year',
          baseStyles.year
        );

        return (
          <Page
            key={index}
            size="A4"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <Image
                src={backgroundImage}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </View>

            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 40,
              }}
            >
              <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
                {renderBlock(headerLines, headerStyle)}
                {renderBlock([gramotaType], gramotaTypeStyle)}
                {renderBlock(['НАГРАЖДАЕТСЯ'], nagrStyle)}

                {renderBlock(fioLines, fioStyle)}
                {renderBlock([staff.post || ''], positionStyle)}
                {renderBlock(['Команда _____________________________________'], teamStyle)}
                {renderBlock(textLines, textStyle)}
              </View>

              <View style={{ alignItems: 'center', width: '100%' }}>
                {renderSignatures(signaturesStyle, approver, signer)}
                {renderBlock([new Date().getFullYear().toString()], yearStyle)}
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default GramotaPDFDocument;
