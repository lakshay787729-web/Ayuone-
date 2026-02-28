export interface Metric {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  icon: string;
  color: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goals: string[];
  language: 'English' | 'Hindi' | 'Hinglish';
  notificationsEnabled: boolean;
  notificationSettings: {
    water: { enabled: boolean; times: string[] };
    workout: { enabled: boolean; times: string[] };
    sleep: { enabled: boolean; times: string[] };
    hydration: { enabled: boolean; times: string[] };
  };
}

export interface HealthData {
  metrics: Metric[];
  history: Message[];
  profile: UserProfile;
}
