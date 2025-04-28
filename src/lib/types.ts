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

export type ChargerConnector = {
  id: number;
  stationId: number;
  type: string;
  power: number;
  status: "Available" | "Charging" | "Out of Service";
};

export type ChargerStation = {
  id: number;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  connectors: ChargerConnector[];
  status?: "Available" | "Charging" | "Out of Service";
  power?: number;
  connectorType?: string;
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
  register: (
    username: string,
    password: string,
    name: string,
    vehicle: string
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

export type ChargingContextType = {
  startCharging: (
    stationId: number,
    connectorId: number,
    kwhLimit: number
  ) => void;
  stopCharging: (stationId: number, connectorId: number) => void;
  isCharging: boolean;
  currentSession: {
    stationId: number | null;
    connectorId: number | null;
    startTime: number | null;
    elapsedTime: number;
    kWh: number;
    kwhLimit: number;
  };
};
