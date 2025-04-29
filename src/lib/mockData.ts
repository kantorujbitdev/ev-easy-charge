import { User, ChargerStation, ChargingSession } from "./types";

export const users: User[] = [
  {
    id: 1,
    username: "user1",
    password: "user1",
    name: "Alice Johnson",
    vehicle: "Nissan Leaf",
    licensePlate: "B1234AJ",
    email: "alice@example.com",
    phone: "555-123-4567",
    profileImage: "/placeholder.svg",
  },
  {
    id: 2,
    username: "user2",
    password: "user2",
    name: "Bob Smith",
    vehicle: "Tesla Model 3",
    licensePlate: "B5678BOB",
    email: "bob@example.com",
    phone: "555-987-6543",
    profileImage: "/placeholder.svg",
  },
  {
    id: 3,
    username: "admin",
    password: "admin",
    name: "ADMIN GORAL",
    vehicle: "BYD M6",
    licensePlate: "B1234ADM",
    email: "admin@example.com",
    phone: "555-987-6543",
    profileImage: "/placeholder.svg",
  },
];

export const chargers: ChargerStation[] = [
  {
    id: 101,
    name: "Station A",
    location: "Lot 1",
    latitude: 51.5074,
    longitude: -0.1278,
    address: "123 Main St, City Center",
    connectors: [
      {
        id: 1011,
        stationId: 101,
        type: "Type 2",
        power: 22,
        status: "Available",
      },
      {
        id: 1012,
        stationId: 101,
        type: "CCS",
        power: 50,
        status: "Available",
      },
    ],
  },
  {
    id: 102,
    name: "Station B",
    location: "Lot 2",
    latitude: 51.5084,
    longitude: -0.1268,
    address: "456 Oak Ave, Downtown",
    connectors: [
      {
        id: 1021,
        stationId: 102,
        type: "CCS",
        power: 50,
        status: "Charging",
      },
      {
        id: 1022,
        stationId: 102,
        type: "CHAdeMO",
        power: 50,
        status: "Available",
      },
    ],
  },
  {
    id: 103,
    name: "Station C",
    location: "Lot 3",
    latitude: 51.5094,
    longitude: -0.1258,
    address: "789 Pine Rd, Uptown",
    connectors: [
      {
        id: 1031,
        stationId: 103,
        type: "Type 2",
        power: 11,
        status: "Out of Service",
      },
    ],
  },
  {
    id: 104,
    name: "Station D",
    location: "Lot 4",
    latitude: 51.5104,
    longitude: -0.1248,
    address: "321 Elm St, Westside",
    connectors: [
      {
        id: 1041,
        stationId: 104,
        type: "Type 2",
        power: 11,
        status: "Available",
      },
      {
        id: 1042,
        stationId: 104,
        type: "CCS",
        power: 50,
        status: "Available",
      },
    ],
  },
  {
    id: 105,
    name: "Station E",
    location: "Lot 5",
    latitude: 51.5114,
    longitude: -0.1238,
    address: "654 Maple Dr, Eastside",
    connectors: [
      {
        id: 1051,
        stationId: 105,
        type: "CCS",
        power: 150,
        status: "Available",
      },
    ],
  },
];

export const chargingSessions: ChargingSession[] = [
  {
    id: 1001,
    userId: 1,
    stationId: 101,
    station: "Station A",
    date: "2025-04-20",
    startTime: "14:30",
    endTime: "15:05",
    duration: "35 mins",
    kWh: 12.4,
  },
  {
    id: 1002,
    userId: 1,
    stationId: 102,
    station: "Station B",
    date: "2025-04-15",
    startTime: "09:15",
    endTime: "10:00",
    duration: "45 mins",
    kWh: 22.5,
  },
  {
    id: 1003,
    userId: 1,
    stationId: 104,
    station: "Station D",
    date: "2025-04-10",
    startTime: "18:00",
    endTime: "18:25",
    duration: "25 mins",
    kWh: 8.2,
  },
  {
    id: 2001,
    userId: 2,
    stationId: 102,
    station: "Station B",
    date: "2025-04-21",
    startTime: "12:10",
    endTime: "12:52",
    duration: "42 mins",
    kWh: 18.6,
  },
  {
    id: 2002,
    userId: 2,
    stationId: 105,
    station: "Station E",
    date: "2025-04-18",
    startTime: "16:40",
    endTime: "17:10",
    duration: "30 mins",
    kWh: 24.8,
  },
  {
    id: 3001,
    userId: 3,
    stationId: 101,
    station: "Station A",
    date: "2025-04-20",
    startTime: "14:30",
    endTime: "15:05",
    duration: "35 mins",
    kWh: 12.4,
  },
  {
    id: 3002,
    userId: 3,
    stationId: 102,
    station: "Station B",
    date: "2025-04-15",
    startTime: "09:15",
    endTime: "10:00",
    duration: "45 mins",
    kWh: 22.5,
  },
  {
    id: 3003,
    userId: 3,
    stationId: 104,
    station: "Station D",
    date: "2025-04-10",
    startTime: "18:00",
    endTime: "18:25",
    duration: "25 mins",
    kWh: 8.2,
  },
  {
    id: 3001,
    userId: 3,
    stationId: 102,
    station: "Station B",
    date: "2025-04-21",
    startTime: "12:10",
    endTime: "12:52",
    duration: "42 mins",
    kWh: 18.6,
  },
  {
    id: 3002,
    userId: 3,
    stationId: 105,
    station: "Station E",
    date: "2025-04-18",
    startTime: "16:40",
    endTime: "17:10",
    duration: "30 mins",
    kWh: 24.8,
  },
];

export const getUserSessions = (userId: number): ChargingSession[] => {
  return chargingSessions.filter((session) => session.userId === userId);
};

export const findUserByUsername = (username: string): User | undefined => {
  return users.find((user) => user.username === username);
};

export const getChargerById = (id: number): ChargerStation | undefined => {
  return chargers.find((charger) => charger.id === id);
};

export const updateChargerStatus = (
  id: number,
  status: "Available" | "Charging" | "Out of Service"
): void => {
  const charger = chargers.find((c) => c.id === id);
  if (charger) {
    // Update all connectors at the station
    charger.connectors.forEach((connector) => {
      connector.status = status;
    });
  }
};

export const updateConnectorStatus = (
  stationId: number,
  connectorId: number,
  status: "Available" | "Charging" | "Out of Service"
): void => {
  const station = chargers.find((s) => s.id === stationId);
  if (station) {
    const connector = station.connectors.find((c) => c.id === connectorId);
    if (connector) {
      connector.status = status;
    }
  }
};

export const registerNewUser = async (
  username: string,
  password: string,
  name: string,
  vehicle: string,
  licensePlate: string
) => {
  // Generate a new user ID (would be handled by backend in real app)
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

  const newUser = {
    id: newId,
    username,
    password,
    name,
    vehicle,
    licensePlate,
  };

  users.push(newUser);

  return newUser;
};

export const getSessionById = (sessionId: number) => {
  return chargingSessions.find((session) => session.id === sessionId) || null;
};
