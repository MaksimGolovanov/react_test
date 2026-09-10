// src/features/plans/utils/PlanDocxGenerator.js
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

const loadTemplate = async () => {
  const response = await fetch('/templates/plan_template.docx');
  if (!response.ok) {
    throw new Error(
      'Шаблон не найден. Поместите plan_template.docx в public/templates/'
    );
  }
  return await response.arrayBuffer();
};

const prepareData = (plan) => {
  // Формируем полный текст этапов с правильными отступами
  let stagesText = '';
  const stages = plan.stages || [];
  stages.forEach((stage, idx) => {
    const title = stage.title?.trim() || `Этап ${idx + 1}`;
    stagesText += `${title}\n`;
    const items = stage.items || [];
    items.forEach((item) => {
      const text =
        typeof item === 'string' ? item.trim() : (item.text || '').trim();
      if (text) {
        stagesText += `  ${text}\n`;
      }
      const subitems = Array.isArray(item.subitems) ? item.subitems : [];
      subitems.forEach((sub) => {
        const s = sub.trim();
        if (s) {
          stagesText += `    – ${s}\n`;
        }
      });
    });
    // Добавляем разделитель между этапами (один перенос), но не после последнего
    if (idx < stages.length - 1) {
      stagesText += '\n';
    }
  });
  // Убираем последний перенос, если он есть (на случай, если после цикла остался)
  if (stagesText.endsWith('\n')) {
    stagesText = stagesText.slice(0, -1);
  }

  return {
    title: plan.title || '',
    filial: plan.filial || '',
    location: plan.location || '',
    goal: plan.goal || '',
    responsibleFireWorks: plan.responsibleFireWorks || '',
    responsiblePrepFireWorks: plan.responsiblePrepFireWorks || '',
    responsibleComm: plan.responsibleComm || '',
    startDate: plan.startDate || '',
    endDate: plan.endDate || '',
    totalHours: plan.totalHours || '',
    gasSupply: plan.gasSupply || '',
    stagesText, // ← новое поле с готовым текстом

    posts: plan.posts || [],
    materials: plan.materials || [],
    technologicalSequence: plan.technologicalSequence || [],
    appendices: plan.appendices || [],
    hazardFactors: (plan.safety?.hazardFactors || []).filter((f) => f.trim()),
    safetyMeasures: plan.safety?.measures || '',
    thirdPartyAdmission: plan.safety?.thirdPartyAdmission || '',
    communicationPosts: plan.communication?.posts || [],
  };
};

export const generatePlanDocx = async (plan) => {
  try {
    const templateBuffer = await loadTemplate();
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const data = prepareData(plan);
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

export const downloadPlanDocx = async (plan) => {
  try {
    const blob = await generatePlanDocx(plan);
    const fileName = `План_ОР_${plan.title || 'без_названия'}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    alert('Не удалось создать документ. Проверьте консоль.');
  }
};
