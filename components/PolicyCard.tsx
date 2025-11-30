import React from 'react';
import { Policy } from '../types';

interface PolicyCardProps {
  policy: Policy;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy }) => {
  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(policy.endDate);
  const totalDuration = 365; // Assuming 1 year standard
  const progressPercentage = Math.max(0, Math.min(100, (daysLeft / totalDuration) * 100));
  
  // Color logic based on urgency
  let statusColor = "bg-green-500";
  let textColor = "text-green-700";
  let bgColor = "bg-green-50";

  if (daysLeft < 30) {
    statusColor = "bg-red-500";
    textColor = "text-red-700";
    bgColor = "bg-red-50";
  } else if (daysLeft < 90) {
    statusColor = "bg-yellow-500";
    textColor = "text-yellow-700";
    bgColor = "bg-yellow-50";
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-2 rounded-bl-xl ${bgColor} ${textColor} text-xs font-bold`}>
        {daysLeft > 0 ? `${daysLeft} Gün Kaldı` : 'Süresi Doldu'}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{policy.type}</h3>
          <p className="text-gray-500 text-sm">{policy.plateNumber}</p>
        </div>
        <div className="p-2 bg-gray-100 rounded-full">
            <span className="material-icons text-gray-600">directions_car</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
            <span className="text-gray-500">Araç:</span>
            <span className="font-medium text-gray-700">{policy.vehicleInfo || 'Belirtilmedi'}</span>
        </div>
        <div className="flex justify-between text-sm">
            <span className="text-gray-500">Bitiş:</span>
            <span className="font-medium text-gray-700">{new Date(policy.endDate).toLocaleDateString('tr-TR')}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div 
            className={`h-2.5 rounded-full ${statusColor} transition-all duration-1000 ease-out`} 
            style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-400 text-right">Poliçe Süresi</p>
    </div>
  );
};

export default PolicyCard;