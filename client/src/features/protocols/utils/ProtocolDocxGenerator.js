// src/features/protocols/utils/ProtocolDocxGenerator.js
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

const loadTemplate = async () => {
  const response = await fetch('/templates/protocol_template.docx');
  if (!response.ok) {
    throw new Error(
      'Шаблон протокола не найден. Поместите protocol_template.docx в public/templates/'
    );
  }
  return await response.arrayBuffer();
};

// Форматирование даты в русском формате
const formatDateToRussian = (dateStr) => {
  if (!dateStr) return '__ ________ ____ г.';
  try {
    if (dateStr.includes(' ')) return dateStr;
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

// Безопасное преобразование programSections в строку
const getProgramSections = (sections) => {
  if (!sections) return '';
  if (Array.isArray(sections)) return sections.join('; ');
  if (typeof sections === 'string') return sections;
  return '';
};

// Функция для объединения списка в строку с переносами
const joinWithNewlines = (items, formatter) => {
  if (!items || items.length === 0) return '';
  return items.map(formatter).filter(Boolean).join('\n');
};

const prepareData = (protocol) => {
  const workers = protocol.workers || [];
  const members = protocol.commission?.members || [];
  const reps = protocol.commission?.representatives || [];

  const formatWorker = (w) => ({
    fullName: w.fullName || '',
    profession: w.profession || '',
    workplace: w.workplace || '',
    result: w.result || '',
    certificateNumber: w.certificateNumber || '',
    checkReason: w.checkReason || '',
    registryNumber: w.registryNumber || '',
    signed: w.signed ? '✔' : '',
  });

  const formattedDate = formatDateToRussian(protocol.date);

  // Формируем строки с переносами для членов комиссии и представителей
  const commissionMembersStr = joinWithNewlines(members, (m) => 
    `${m.name || ''} (${m.position || ''})`
  );
  
  const commissionRepresentativesStr = joinWithNewlines(reps, (r) => 
    `${r.name || ''} (${r.role || ''})`
  );

  return {
    number: protocol.number || '',
    date: formattedDate,
    organization: protocol.organization || '',
    trainingCenter: protocol.trainingCenter || '',
    programName: protocol.programName || '',
    programDuration: protocol.programDuration || '',
    programSections: getProgramSections(protocol.programSections),
    commissionChairman: `${protocol.commission?.chairman?.name || ''} (${protocol.commission?.chairman?.position || ''})`,
    commissionDeputy: `${protocol.commission?.deputy?.name || ''} (${protocol.commission?.deputy?.position || ''})`,
    commissionMembers: commissionMembersStr, // теперь это строка с переносами
    commissionRepresentatives: commissionRepresentativesStr, // теперь это строка с переносами
    workers: workers.map(formatWorker),
    notes: protocol.notes || '',
  };
};

export const generateProtocolDocx = async (protocol) => {
  try {
    const templateBuffer = await loadTemplate();
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true, // важно для корректного отображения \n
    });

    const data = prepareData(protocol);
    doc.render(data);

    return doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  } catch (error) {
    console.error('Ошибка генерации DOCX:', error);
    if (error.properties?.errors) {
      console.error('Детали ошибок:', error.properties.errors);
    }
    throw error;
  }
};

export const downloadProtocolDocx = async (protocol) => {
  try {
    const blob = await generateProtocolDocx(protocol);
    const fileName = `Протокол_${protocol.number || 'без_номера'}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    alert('Не удалось создать документ. Проверьте консоль.');
  }
};