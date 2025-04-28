
import { User, ChargerStation, ChargingSession } from "./types";

export const users: User[] = [
  {
    id: 1,
    username: "user1",
    password: "user1",
    name: "Alice Johnson",
    vehicle: "Nissan Leaf",
    email: "alice@example.com",
    phone: "555-123-4567",
    profileImage: "/placeholder.svg"
  },
  {
    id: 2,
    username: "user2",
    password: "user2",
    name: "Bob Smith",
    vehicle: "Tesla Model 3",
    email: "bob@example.com",
    phone: "555-987-6543",
    profileImage: "/placeholder.svg"
  }
];

export const chargers: ChargerStation[] = [
  {
    id: 101,
    name: "Station A",
    status: "Available",
    location: "Lot 1",
    connectorType: "Type 2",
    power: 22,
    latitude: 51.5074,
    longitude: -0.1278,
    address: "123 Main St, City Center"
  },
  {
    id: 102,
    name: "Station B",
    status: "Charging",
    location: "Lot 2",
    connectorType: "CCS",
    power: 50,
    latitude: 51.5084,
    longitude: -0.1268,
    address: "456 Oak Ave, Downtown"
  },
  {
    id: 103,
    name: "Station C",
    status: "Out of Service",
    location: "Lot 3",
    connectorType: "CHAdeMO",
    power: 50,
    latitude: 51.5094,
    longitude: -0.1258,
    address: "789 Pine Rd, Uptown"
  },
  {
    id: 104,
    name: "Station D",
    status: "Available",
    location: "Lot 4",
    connectorType: "Type 2",
    power: 11,
    latitude: 51.5104,
    longitude: -0.1248,
    address: "321 Elm St, Westside"
  },
  {
    id: 105,
    name: "Station E",
    status: "Available",
    location: "Lot 5",
    connectorType: "CCS",
    power: 150,
    latitude: 51.5114,
    longitude: -0.1238,
    address: "654 Maple Dr, Eastside"
  }
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
    kWh: 12.4
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
    kWh: 22.5
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
    kWh: 8.2
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
    kWh: 18.6
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
    kWh: 24.8
  }
];

// Helper function to get sessions for a specific user
export const getUserSessions = (userId: number): ChargingSession[] => {
  return chargingSessions.filter(session => session.userId === userId);
};

// Helper function to find a user by username
export const findUserByUsername = (username: string): User | undefined => {
  return users.find(user => user.username === username);
};

// Helper function to get a charger by ID
export const getChargerById = (id: number): ChargerStation | undefined => {
  return chargers.find(charger => charger.id === id);
};

// Helper function to update charger status
export const updateChargerStatus = (id: number, status: 'Available' | 'Charging' | 'Out of Service'): void => {
  const charger = chargers.find(c => c.id === id);
  if (charger) {
    charger.status = status;
  }
};
