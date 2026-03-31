
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  phone?: string;
  role: 'user' | 'vendor';
  isPremium?: boolean;
  company?: string;
  createdAt: string;
  lastLogin: string;
}

export interface RoomAnalysis {
  roomType: string;
  dimensionsEstimate: string;
  lightingCondition: string;
  detectedFeatures: string[];
  wallCondition: string;
  dominantColors: string[];
  isRoomOnly: boolean;
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  name: string;
  type: 'wall' | 'floor' | 'ceiling' | 'furniture';
  finish: string;
  reason: string;
  environment: string;
  imageUrl: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  role: 'user' | 'vendor';
  name: string;
  email: string;
  id: string;
  isPremium?: boolean;
  avatarUrl?: string;
}
