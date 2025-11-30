import React, { useState } from 'react';
import { Policy, PolicyType } from '../types';

interface AdminPanelProps {
  policies: Policy[];
  onAddPolicy: (policy: Policy) => void;
  onDeletePolicy: (id: string) => void;
  onUpdatePolicy: (policy: Policy) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ policies, onAddPolicy, onDeletePolicy, onUpdatePolicy }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPolicy, setNewPolicy] = useState<Partial<Policy>>({
    type: PolicyType.TRAFFIC,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
  });

  const resetForm = () => {
    setEditingId(null);
    setNewPolicy({
      type: PolicyType.TRAFFIC,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      plateNumber: '',
      holderName: '',
      premium: 0,
      vehicleInfo: ''
    });
  };

  const handleEdit = (policy: Policy) => {
    setEditingId(policy.id);
    setNewPolicy({
      ...policy,
      startDate: policy.startDate.split('T')[0], // Ensure format for input type="date"
      endDate: policy.endDate.split('T')[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPolicy.plateNumber && newPolicy.holderName && newPolicy.premium) {
      if (editingId) {
        // Update Logic
        const updatedPolicy: Policy = {
          id: editingId,
          plateNumber: newPolicy.plateNumber,
          holderName: newPolicy.holderName,
          type: newPolicy.type as PolicyType,
          startDate: newPolicy.startDate || new Date().toISOString(),
          endDate: newPolicy.endDate || new Date().toISOString(),
          premium: Number(newPolicy.premium),
          vehicleInfo: newPolicy.vehicleInfo || '',
        };
        onUpdatePolicy(updatedPolicy);
      } else {
        // Add Logic
        const policy: Policy = {
          id: Math.random().toString(36).substr(2, 9),
          plateNumber: newPolicy.plateNumber,
          holderName: newPolicy.holderName,
          type: newPolicy.type as PolicyType,
          startDate: newPolicy.startDate || new Date().toISOString(),
          endDate: newPolicy.endDate || new Date().toISOString(),
          premium: Number(newPolicy.premium),
          vehicleInfo: newPolicy.vehicleInfo || '',
        };
        onAddPolicy(policy);
      }
      resetForm();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="material-icons text-brand-600">admin_panel_settings</span>
        Yönetim Paneli - Veri Seti
      </h2>

      {/* Add/Edit Policy Form */}
      <div className={`p-4 rounded-lg border mb-8 transition-colors ${editingId ? 'bg-orange-50 border-orange-200' : 'bg-brand-50 border-brand-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${editingId ? 'text-orange-900' : 'text-brand-900'}`}>
            {editingId ? 'Poliçe Güncelle' : 'Yeni Poliçe Ekle'}
          </h3>
          {editingId && (
            <button 
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Vazgeç
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Ad Soyad"
            className="p-2 border rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
            value={newPolicy.holderName || ''}
            onChange={e => setNewPolicy({...newPolicy, holderName: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Plaka No (Örn: 34ABC123)"
            className="p-2 border rounded-md focus:ring-2 focus:ring-brand-500 outline-none uppercase"
            value={newPolicy.plateNumber || ''}
            onChange={e => setNewPolicy({...newPolicy, plateNumber: e.target.value.toUpperCase()})}
            required
          />
          <input
            type="text"
            placeholder="Araç Bilgisi (Örn: 2022 BMW 3.20)"
            className="p-2 border rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
            value={newPolicy.vehicleInfo || ''}
            onChange={e => setNewPolicy({...newPolicy, vehicleInfo: e.target.value})}
          />
          <select
            className="p-2 border rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
            value={newPolicy.type}
            onChange={e => setNewPolicy({...newPolicy, type: e.target.value as PolicyType})}
          >
            {Object.values(PolicyType).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="date"
            className="p-2 border rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
            value={newPolicy.startDate}
            onChange={e => setNewPolicy({...newPolicy, startDate: e.target.value})}
            required
          />
          <input
            type="date"
            className="p-2 border rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
            value={newPolicy.endDate}
            onChange={e => setNewPolicy({...newPolicy, endDate: e.target.value})}
            required
          />
           <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₺</span>
            <input
              type="number"
              placeholder="Tutar"
              className="p-2 pl-8 border rounded-md focus:ring-2 focus:ring-brand-500 outline-none w-full"
              value={newPolicy.premium || ''}
              onChange={e => setNewPolicy({...newPolicy, premium: Number(e.target.value)})}
              required
            />
          </div>
          <button
            type="submit"
            className={`${editingId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-brand-600 hover:bg-brand-700'} text-white p-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium`}
          >
            <span className="material-icons text-sm">{editingId ? 'save' : 'add'}</span> 
            {editingId ? 'Güncelle' : 'Ekle'}
          </button>
        </form>
      </div>

      {/* Policies Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür / Araç</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bitiş Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {policies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{policy.holderName}</div>
                  <div className="text-sm text-gray-500">{policy.plateNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{policy.type}</div>
                  <div className="text-xs text-gray-500">{policy.vehicleInfo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(policy.endDate).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ₺{policy.premium.toLocaleString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(policy)}
                    className="text-brand-600 hover:text-brand-900 transition-colors mr-3"
                    title="Düzenle"
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  <button
                    onClick={() => onDeletePolicy(policy.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Sil"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {policies.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Henüz kayıtlı poliçe bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;