
export type User = {
  id: number;
  username: string;
  password: string;
  name: string;
  vehicle: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};

export type ChargerStation = {
  id: number;
  name: string;
  status: 'Available' | 'Charging' | 'Out of Service';
  location: string;
  connectorType?: string;
  power?: number; // kW
  price?: number; // per kWh
  latitude?: number;
  longitude?: number;
  address?: string;
};

export type ChargingSession = {
  id: number;
  userId: number;
  stationId: number;
  station: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration: string;
  kWh: number;
};

export type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

export type ChargingContextType = {
  startCharging: (stationId: number) => void;
  stopCharging: (stationId: number) => void;
  isCharging: boolean;
  currentSession: {
    stationId: number | null;
    startTime: number | null;
    elapsedTime: number;
    kWh: number;
  };
};
