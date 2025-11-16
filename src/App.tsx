import { useState } from 'react';
import { Scale } from 'lucide-react';
import IndictmentForm from './components/IndictmentForm';
import IndictmentsList from './components/IndictmentsList';
import { Indictment } from './lib/supabase';

function App() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingIndictment, setEditingIndictment] = useState<Indictment | undefined>();
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (indictment: Indictment) => {
    setEditingIndictment(indictment);
    setView('form');
  };

  const handleNew = () => {
    setEditingIndictment(undefined);
    setView('form');
  };

  const handleSave = () => {
    setRefresh(!refresh);
    setTimeout(() => {
      setView('list');
      setEditingIndictment(undefined);
    }, 1500);
  };

  const handleBackToList = () => {
    setEditingIndictment(undefined);
    setView('list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Scale size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Система автоматизации работы следователя</h1>
              <p className="text-sm text-gray-600 mt-1">Составление обвинительных заключений по УПК РФ</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'form' && (
          <div className="mb-4">
            <button
              onClick={handleBackToList}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Вернуться к списку
            </button>
          </div>
        )}

        {view === 'list' ? (
          <IndictmentsList
            onEdit={handleEdit}
            onNew={handleNew}
            refresh={refresh}
          />
        ) : (
          <IndictmentForm
            onSave={handleSave}
            editData={editingIndictment}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Система составления обвинительных заключений в соответствии с Уголовно-процессуальным кодексом РФ</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
