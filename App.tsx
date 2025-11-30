import React, { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import ChatBot from './components/ChatBot';
import PolicyCard from './components/PolicyCard';
import { Policy, PolicyType } from './types';

// Mock Initial Data
const INITIAL_POLICIES: Policy[] = [
  {
    id: '1',
    plateNumber: '34ABC123',
    holderName: 'Ahmet Yılmaz',
    type: PolicyType.TRAFFIC,
    startDate: '2023-10-25',
    endDate: '2024-10-25',
    premium: 4500,
    vehicleInfo: '2019 Renault Megane'
  },
  {
    id: '2',
    plateNumber: '06XYZ987',
    holderName: 'Ayşe Demir',
    type: PolicyType.CASCO,
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    premium: 12000,
    vehicleInfo: '2021 Peugeot 3008'
  },
  {
    id: '3',
    plateNumber: '35DEF456',
    holderName: 'Mehmet Kaya',
    type: PolicyType.DASK,
    startDate: '2023-05-20',
    endDate: '2024-05-20',
    premium: 850,
    vehicleInfo: 'Konut - Kadıköy'
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<'client' | 'admin'>('client');
  const [policies, setPolicies] = useState<Policy[]>(() => {
    const saved = localStorage.getItem('policies');
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
  });

  useEffect(() => {
    localStorage.setItem('policies', JSON.stringify(policies));
  }, [policies]);

  const handleAddPolicy = (newPolicy: Policy) => {
    setPolicies(prev => [...prev, newPolicy]);
  };

  const handleUpdatePolicy = (updatedPolicy: Policy) => {
    setPolicies(prev => prev.map(p => p.id === updatedPolicy.id ? updatedPolicy : p));
  };

  const handleDeletePolicy = (id: string) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 p-2 rounded-lg text-white">
                 <span className="material-icons">security</span>
              </div>
              <span className="text-xl font-bold text-gray-800">SigortaAsistanı</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView('client')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'client' 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Müşteri Paneli
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'admin' 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Yönetici Paneli
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'client' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* Left Column: Dashboard Stats & Cards */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-2">Hoş Geldiniz</h1>
                <p className="opacity-90">Poliçelerinizi buradan takip edebilir, sağdaki asistanımızdan anında teklif ve destek alabilirsiniz.</p>
                <div className="mt-6 flex gap-8">
                   <div>
                      <div className="text-3xl font-bold">{policies.length}</div>
                      <div className="text-sm opacity-80">Aktif Poliçe</div>
                   </div>
                   <div>
                      <div className="text-3xl font-bold">
                        {policies.reduce((acc, curr) => acc + curr.premium, 0).toLocaleString('tr-TR')} ₺
                      </div>
                      <div className="text-sm opacity-80">Toplam Prim</div>
                   </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Poliçelerim</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policies.map(policy => (
                  <PolicyCard key={policy.id} policy={policy} />
                ))}
                {policies.length === 0 && (
                  <div className="col-span-2 text-center py-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                    Görüntülenecek poliçe yok.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Chatbot */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-24">
                <ChatBot policies={policies} />
              </div>
            </div>
          </div>
        ) : (
          /* Admin View */
          <div className="max-w-5xl mx-auto">
             <AdminPanel 
               policies={policies} 
               onAddPolicy={handleAddPolicy} 
               onDeletePolicy={handleDeletePolicy}
               onUpdatePolicy={handleUpdatePolicy}
             />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;