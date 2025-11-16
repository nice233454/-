import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, BorderStyle, AlignmentType, PageBreak, UnderlineType } from 'docx';
import { Indictment } from './supabase';

export const exportToWord = async (formData: Omit<Indictment, 'id' | 'created_at' | 'updated_at'>) => {
  const createParagraph = (text: string, bold = false, alignment = AlignmentType.LEFT) =>
    new Paragraph({
      text,
      run: new TextRun({ bold, size: 22 }),
      alignment,
    });

  const createHeading = (text: string) =>
    new Paragraph({
      text,
      run: new TextRun({ bold: true, size: 24, underline: { type: UnderlineType.SINGLE } }),
      alignment: AlignmentType.LEFT,
      spacing: { before: 200, after: 200 },
    });

  const createSection = (title: string, content: string) => [
    createHeading(title),
    new Paragraph({
      text: content || '(не указано)',
      run: new TextRun({ size: 22 }),
      alignment: AlignmentType.LEFT,
      spacing: { line: 360, lineRule: 'auto' },
    }),
  ];

  const sections = [
    new Paragraph({
      text: 'ОБВИНИТЕЛЬНОЕ ЗАКЛЮЧЕНИЕ',
      run: new TextRun({ bold: true, size: 28 }),
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    new Paragraph({
      text: `Составлено: ${formData.completion_date}`,
      run: new TextRun({ size: 22 }),
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Место: ${formData.completion_location}`,
      run: new TextRun({ size: 22 }),
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Следователь: ${formData.investigator_name}`,
      run: new TextRun({ size: 22 }),
      spacing: { after: 400 },
    }),

    ...createSection('1. ДАННЫЕ ОБ ОБВИНЯЕМОМ(-ЫХ)', formData.accused_names),

    ...createSection('2. ДАННЫЕ О ЛИЧНОСТИ КАЖДОГО ИЗ НИХ', formData.personal_data),

    createHeading('3. СУЩЕСТВО ОБВИНЕНИЯ'),

    new Paragraph({
      text: `Место совершения преступления: ${formData.crime_location}`,
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto' },
    }),

    new Paragraph({
      text: `Время совершения преступления: ${formData.crime_time}`,
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto' },
    }),

    new Paragraph({
      text: `Способы совершения преступления: ${formData.crime_methods}`,
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto' },
    }),

    new Paragraph({
      text: `Мотивы совершения преступления: ${formData.crime_motives}`,
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto' },
    }),

    new Paragraph({
      text: `Цели совершения преступления: ${formData.crime_goals}`,
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto' },
    }),

    new Paragraph({
      text: `Последствия преступления: ${formData.crime_consequences}`,
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto' },
    }),

    new Paragraph({
      text: `Иные обстоятельства: ${formData.other_circumstances}`,
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 400 },
    }),

    new Paragraph({
      text: 'Описание обвинения:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      text: formData.charges_description || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 400 },
    }),

    ...createSection('4. ФОРМУЛИРОВКА ПРЕДЪЯВЛЕННОГО ОБВИНЕНИЯ', formData.criminal_code_article),

    ...createSection('5. ПЕРЕЧЕНЬ ДОКАЗАТЕЛЬСТВ, ПОДТВЕРЖДАЮЩИХ ОБВИНЕНИЕ', formData.prosecution_evidence),

    ...createSection('6. ПЕРЕЧЕНЬ ДОКАЗАТЕЛЬСТВ, НА КОТОРЫЕ ССЫЛАЕТСЯ СТОРОНА ЗАЩИТЫ', formData.defense_evidence),

    ...createSection('7. ОБСТОЯТЕЛЬСТВА, СМЯГЧАЮЩИЕ НАКАЗАНИЕ', formData.mitigating_circumstances),

    ...createSection('8. ОБСТОЯТЕЛЬСТВА, ОТЯГЧАЮЩИЕ НАКАЗАНИЕ', formData.aggravating_circumstances),

    createHeading('9. ДАННЫЕ О ПОТЕРПЕВШЕМ И РАЗМЕР ПРИЧИНЕННОГО ВРЕДА'),

    new Paragraph({
      text: 'Данные о потерпевшем:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.victim_data || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 200 },
    }),

    new Paragraph({
      text: 'Характер и размер причиненного вреда:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.damage_description || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 400 },
    }),

    createHeading('10. ДАННЫЕ О ГРАЖДАНСКОМ ИСТЦЕ И ГРАЖДАНСКОМ ОТВЕТЧИКЕ'),

    new Paragraph({
      text: 'Гражданский истец:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.civil_plaintiff || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 200 },
    }),

    new Paragraph({
      text: 'Гражданский ответчик:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.civil_defendant || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 200 },
    }),

    new Paragraph({
      text: 'Информация о гражданском иске:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.civil_claim || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 400 },
    }),

    ...createSection('11. ССЫЛКИ НА МАТЕРИАЛЫ ДЕЛА', formData.case_references),

    new PageBreak(),

    new Paragraph({
      text: 'ПРИЛОЖЕНИЯ',
      run: new TextRun({ bold: true, size: 28 }),
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 400 },
    }),

    createHeading('ПРИЛОЖЕНИЕ 1. СПИСОК ЛИЦ, ПОДЛЕЖАЩИХ ВЫЗОВУ В СУДЕБНОЕ ЗАСЕДАНИЕ'),

    new Paragraph({
      text: 'Со стороны обвинения:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.witnesses_prosecution || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 300 },
    }),

    new Paragraph({
      text: 'Со стороны защиты:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.witnesses_defense || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 400 },
    }),

    new PageBreak(),

    createHeading('ПРИЛОЖЕНИЕ 2. СПРАВКА'),

    new Paragraph({
      text: 'Сроки следствия:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.investigation_terms || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 200 },
    }),

    new Paragraph({
      text: 'Избранные меры пресечения:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.preventive_measures || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 200 },
    }),

    new Paragraph({
      text: 'Вещественные доказательства:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.material_evidence || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 200 },
    }),

    new Paragraph({
      text: 'Меры по обеспечению исполнения наказания в виде штрафа:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.penalty_measures || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 200 },
    }),

    new Paragraph({
      text: 'Процессуальные издержки:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.procedural_costs || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 200 },
    }),

    new Paragraph({
      text: 'Меры по обеспечению прав иждивенцев:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.dependents_measures || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 200 },
    }),

    new Paragraph({
      text: 'Информация для перечисления штрафа:',
      run: new TextRun({ bold: true, size: 22 }),
      spacing: { before: 100, after: 100 },
    }),

    new Paragraph({
      text: formData.fine_payment_info || '(не указано)',
      run: new TextRun({ size: 22 }),
      spacing: { line: 360, lineRule: 'auto', after: 400 },
    }),

    new PageBreak(),

    new Paragraph({
      text: 'ПОДПИСЬ',
      run: new TextRun({ bold: true, size: 22 }),
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 600 },
    }),

    new Paragraph({
      text: '_' + '_'.repeat(49),
      run: new TextRun({ size: 22 }),
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: 'Подпись следователя',
      run: new TextRun({ size: 22 }),
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 600 },
    }),

    new Paragraph({
      text: `Дата: ${formData.completion_date}`,
      run: new TextRun({ size: 22 }),
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Место: ${formData.completion_location}`,
      run: new TextRun({ size: 22 }),
      alignment: AlignmentType.CENTER,
    }),
  ];

  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `obvinitelnoye_zaklyuchenie_${formData.completion_date}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
