export enum PolicyType {
  TRAFFIC = 'Trafik Sigortası',
  CASCO = 'Kasko',
  DASK = 'DASK',
  HEALTH = 'Tamamlayıcı Sağlık'
}

export interface Policy {
  id: string;
  plateNumber: string; // Plaka or ID
  holderName: string;
  type: PolicyType;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  premium: number; // Price
  vehicleInfo?: string; // e.g., 2020 Honda Civic
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface GeminiConfig {
  systemInstruction: string;
}