import { useState, FormEvent } from 'react';
import { supabase, Indictment } from '../lib/supabase';
import { Save, FileText, Download } from 'lucide-react';

interface IndictmentFormProps {
  onSave: () => void;
  editData?: Indictment;
}

export default function IndictmentForm({ onSave, editData }: IndictmentFormProps) {
  const [formData, setFormData] = useState<Omit<Indictment, 'id' | 'created_at' | 'updated_at'>>({
    accused_names: editData?.accused_names || '',
    personal_data: editData?.personal_data || '',
    charges_description: editData?.charges_description || '',
    crime_location: editData?.crime_location || '',
    crime_time: editData?.crime_time || '',
    crime_methods: editData?.crime_methods || '',
    crime_motives: editData?.crime_motives || '',
    crime_goals: editData?.crime_goals || '',
    crime_consequences: editData?.crime_consequences || '',
    other_circumstances: editData?.other_circumstances || '',
    criminal_code_article: editData?.criminal_code_article || '',
    prosecution_evidence: editData?.prosecution_evidence || '',
    defense_evidence: editData?.defense_evidence || '',
    mitigating_circumstances: editData?.mitigating_circumstances || '',
    aggravating_circumstances: editData?.aggravating_circumstances || '',
    victim_data: editData?.victim_data || '',
    damage_description: editData?.damage_description || '',
    civil_plaintiff: editData?.civil_plaintiff || '',
    civil_defendant: editData?.civil_defendant || '',
    case_references: editData?.case_references || '',
    investigator_name: editData?.investigator_name || '',
    completion_location: editData?.completion_location || '',
    completion_date: editData?.completion_date || new Date().toISOString().split('T')[0],
    witnesses_prosecution: editData?.witnesses_prosecution || '',
    witnesses_defense: editData?.witnesses_defense || '',
    investigation_terms: editData?.investigation_terms || '',
    preventive_measures: editData?.preventive_measures || '',
    material_evidence: editData?.material_evidence || '',
    civil_claim: editData?.civil_claim || '',
    penalty_measures: editData?.penalty_measures || '',
    procedural_costs: editData?.procedural_costs || '',
    dependents_measures: editData?.dependents_measures || '',
    fine_payment_info: editData?.fine_payment_info || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      if (editData?.id) {
        const { error } = await supabase
          .from('indictments')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editData.id);

        if (error) throw error;
        setMessage('Обвинительное заключение успешно обновлено');
      } else {
        const { error } = await supabase
          .from('indictments')
          .insert([formData]);

        if (error) throw error;
        setMessage('Обвинительное заключение успешно сохранено');
      }

      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (error) {
      setMessage('Ошибка при сохранении: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const generateDocument = () => {
    const doc = `
ОБВИНИТЕЛЬНОЕ ЗАКЛЮЧЕНИЕ

Составлено: ${formData.completion_date}
Место: ${formData.completion_location}
Следователь: ${formData.investigator_name}

1. ДАННЫЕ ОБ ОБВИНЯЕМОМ(-ЫХ)
${formData.accused_names}

2. ДАННЫЕ О ЛИЧНОСТИ
${formData.personal_data}

3. СУЩЕСТВО ОБВИНЕНИЯ
Место совершения преступления: ${formData.crime_location}
Время совершения: ${formData.crime_time}
Способы: ${formData.crime_methods}
Мотивы: ${formData.crime_motives}
Цели: ${formData.crime_goals}
Последствия: ${formData.crime_consequences}
Иные обстоятельства: ${formData.other_circumstances}

Описание обвинения:
${formData.charges_description}

4. ФОРМУЛИРОВКА ОБВИНЕНИЯ
${formData.criminal_code_article}

5. ДОКАЗАТЕЛЬСТВА СТОРОНЫ ОБВИНЕНИЯ
${formData.prosecution_evidence}

6. ДОКАЗАТЕЛЬСТВА СТОРОНЫ ЗАЩИТЫ
${formData.defense_evidence}

7. ОБСТОЯТЕЛЬСТВА, СМЯГЧАЮЩИЕ НАКАЗАНИЕ
${formData.mitigating_circumstances}

8. ОБСТОЯТЕЛЬСТВА, ОТЯГЧАЮЩИЕ НАКАЗАНИЕ
${formData.aggravating_circumstances}

9. ДАННЫЕ О ПОТЕРПЕВШЕМ
${formData.victim_data}

Характер и размер причиненного вреда:
${formData.damage_description}

10. ГРАЖДАНСКИЙ ИСК
Гражданский истец: ${formData.civil_plaintiff}
Гражданский ответчик: ${formData.civil_defendant}
Информация о гражданском иске: ${formData.civil_claim}

11. ССЫЛКИ НА МАТЕРИАЛЫ ДЕЛА
${formData.case_references}

ПРИЛОЖЕНИЯ:

СПИСОК ЛИЦ, ПОДЛЕЖАЩИХ ВЫЗОВУ В СУДЕБНОЕ ЗАСЕДАНИЕ:

Со стороны обвинения:
${formData.witnesses_prosecution}

Со стороны защиты:
${formData.witnesses_defense}

СПРАВКА:

Сроки следствия: ${formData.investigation_terms}
Меры пресечения: ${formData.preventive_measures}
Вещественные доказательства: ${formData.material_evidence}
Меры по обеспечению исполнения наказания: ${formData.penalty_measures}
Процессуальные издержки: ${formData.procedural_costs}
Меры по обеспечению прав иждивенцев: ${formData.dependents_measures}
Информация для перечисления штрафа: ${formData.fine_payment_info}

___________________________
Подпись следователя

    `.trim();

    return doc;
  };

  const exportToTxt = () => {
    const doc = generateDocument();
    const blob = new Blob([doc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obvinitelnoye_zaklyuchenie_${formData.completion_date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Обвинительное заключение</h2>
        <p className="text-sm text-gray-600 mt-1">В соответствии с УПК РФ</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Ошибка') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message}
        </div>
      )}

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">1. Данные об обвиняемом(-ых)</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Фамилии, имена и отчества обвиняемого(-ых)</label>
          <textarea
            value={formData.accused_names}
            onChange={(e) => handleChange('accused_names', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Данные о личности каждого из них</label>
          <textarea
            value={formData.personal_data}
            onChange={(e) => handleChange('personal_data', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            required
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">2. Существо обвинения</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Описание обвинения</label>
          <textarea
            value={formData.charges_description}
            onChange={(e) => handleChange('charges_description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={5}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Место совершения преступления</label>
            <input
              type="text"
              value={formData.crime_location}
              onChange={(e) => handleChange('crime_location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Время совершения</label>
            <input
              type="text"
              value={formData.crime_time}
              onChange={(e) => handleChange('crime_time', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Способы совершения преступления</label>
          <textarea
            value={formData.crime_methods}
            onChange={(e) => handleChange('crime_methods', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Мотивы</label>
            <textarea
              value={formData.crime_motives}
              onChange={(e) => handleChange('crime_motives', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Цели</label>
            <textarea
              value={formData.crime_goals}
              onChange={(e) => handleChange('crime_goals', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Последствия</label>
          <textarea
            value={formData.crime_consequences}
            onChange={(e) => handleChange('crime_consequences', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Другие обстоятельства</label>
          <textarea
            value={formData.other_circumstances}
            onChange={(e) => handleChange('other_circumstances', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">3. Формулировка обвинения</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Статья УК РФ (пункт, часть, статья)</label>
          <input
            type="text"
            value={formData.criminal_code_article}
            onChange={(e) => handleChange('criminal_code_article', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Например: п. 1, ч. 2, ст. 158 УК РФ"
            required
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">4. Доказательства</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Доказательства, подтверждающие обвинение</label>
          <textarea
            value={formData.prosecution_evidence}
            onChange={(e) => handleChange('prosecution_evidence', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={5}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Доказательства стороны защиты</label>
          <textarea
            value={formData.defense_evidence}
            onChange={(e) => handleChange('defense_evidence', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={5}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">5. Обстоятельства, влияющие на наказание</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Смягчающие обстоятельства</label>
          <textarea
            value={formData.mitigating_circumstances}
            onChange={(e) => handleChange('mitigating_circumstances', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Отягчающие обстоятельства</label>
          <textarea
            value={formData.aggravating_circumstances}
            onChange={(e) => handleChange('aggravating_circumstances', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">6. Данные о потерпевшем</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Данные о потерпевшем</label>
          <textarea
            value={formData.victim_data}
            onChange={(e) => handleChange('victim_data', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Характер и размер причиненного вреда</label>
          <textarea
            value={formData.damage_description}
            onChange={(e) => handleChange('damage_description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">7. Гражданский иск</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Гражданский истец</label>
            <textarea
              value={formData.civil_plaintiff}
              onChange={(e) => handleChange('civil_plaintiff', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Гражданский ответчик</label>
            <textarea
              value={formData.civil_defendant}
              onChange={(e) => handleChange('civil_defendant', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Информация о гражданском иске</label>
          <textarea
            value={formData.civil_claim}
            onChange={(e) => handleChange('civil_claim', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">8. Ссылки на материалы дела</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Тома и листы уголовного дела</label>
          <textarea
            value={formData.case_references}
            onChange={(e) => handleChange('case_references', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Например: Том 1, л.д. 15-23; Том 2, л.д. 45-67"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">9. Подписание</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Место составления</label>
            <input
              type="text"
              value={formData.completion_location}
              onChange={(e) => handleChange('completion_location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Дата составления</label>
            <input
              type="date"
              value={formData.completion_date}
              onChange={(e) => handleChange('completion_date', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ФИО следователя</label>
            <input
              type="text"
              value={formData.investigator_name}
              onChange={(e) => handleChange('investigator_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">10. Приложения - Список лиц для вызова</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Лица со стороны обвинения</label>
          <textarea
            value={formData.witnesses_prosecution}
            onChange={(e) => handleChange('witnesses_prosecution', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="ФИО, адрес места жительства и/или пребывания"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Лица со стороны защиты</label>
          <textarea
            value={formData.witnesses_defense}
            onChange={(e) => handleChange('witnesses_defense', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="ФИО, адрес места жительства и/или пребывания"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-600 pl-3">11. Справка</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Сроки следствия</label>
          <textarea
            value={formData.investigation_terms}
            onChange={(e) => handleChange('investigation_terms', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Меры пресечения</label>
          <textarea
            value={formData.preventive_measures}
            onChange={(e) => handleChange('preventive_measures', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="Содержание под стражей, домашний арест и т.д."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Вещественные доказательства</label>
          <textarea
            value={formData.material_evidence}
            onChange={(e) => handleChange('material_evidence', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Меры по обеспечению исполнения наказания в виде штрафа</label>
          <textarea
            value={formData.penalty_measures}
            onChange={(e) => handleChange('penalty_measures', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Процессуальные издержки</label>
          <textarea
            value={formData.procedural_costs}
            onChange={(e) => handleChange('procedural_costs', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Меры по обеспечению прав иждивенцев</label>
          <textarea
            value={formData.dependents_measures}
            onChange={(e) => handleChange('dependents_measures', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Информация для перечисления штрафа</label>
          <textarea
            value={formData.fine_payment_info}
            onChange={(e) => handleChange('fine_payment_info', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Реквизиты согласно законодательству о национальной платежной системе"
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          <Save size={20} />
          {isSaving ? 'Сохранение...' : editData ? 'Обновить' : 'Сохранить'}
        </button>

        <button
          type="button"
          onClick={exportToTxt}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
        >
          <FileText size={20} />
          Экспорт в TXT
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
        >
          <Download size={20} />
          Печать/PDF
        </button>
      </div>
    </form>
  );
}
