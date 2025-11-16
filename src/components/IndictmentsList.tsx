import { useState, useEffect } from 'react';
import { supabase, Indictment } from '../lib/supabase';
import { FileText, Edit, Trash2, Plus } from 'lucide-react';

interface IndictmentsListProps {
  onEdit: (indictment: Indictment) => void;
  onNew: () => void;
  refresh: boolean;
}

export default function IndictmentsList({ onEdit, onNew, refresh }: IndictmentsListProps) {
  const [indictments, setIndictments] = useState<Indictment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIndictments();
  }, [refresh]);

  const loadIndictments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('indictments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIndictments(data || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это обвинительное заключение?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('indictments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadIndictments();
    } catch (error) {
      alert('Ошибка при удалении: ' + (error as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Сохраненные обвинительные заключения</h2>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Создать новое
        </button>
      </div>

      {indictments.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Нет сохраненных обвинительных заключений</p>
          <button
            onClick={onNew}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Создать первое заключение
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {indictments.map((indictment) => (
            <div
              key={indictment.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {indictment.accused_names || 'Без названия'}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Статья УК РФ:</span> {indictment.criminal_code_article || '—'}</p>
                    <p><span className="font-medium">Следователь:</span> {indictment.investigator_name || '—'}</p>
                    <p><span className="font-medium">Дата:</span> {indictment.completion_date ? new Date(indictment.completion_date).toLocaleDateString('ru-RU') : '—'}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(indictment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(indictment.id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              {indictment.charges_description && (
                <p className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-3 rounded">
                  {indictment.charges_description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
