
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { ChargingContextType } from '@/lib/types';
import { updateConnectorStatus } from '@/lib/mockData';
import { toast } from 'sonner';

const ChargingContext = createContext<ChargingContextType>({
  startCharging: () => {},
  stopCharging: () => {},
  isCharging: false,
  currentSession: {
    stationId: null,
    startTime: null,
    elapsedTime: 0,
    kWh: 0,
    kwhLimit: 20,
  },
});

export const ChargingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCharging, setIsCharging] = useState(false);
  const [currentSession, setCurrentSession] = useState({
    stationId: null as number | null,
    startTime: null as number | null,
    elapsedTime: 0,
    kWh: 0,
    kwhLimit: 20,
  });
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isCharging && currentSession.startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - currentSession.startTime!;
        const elapsedMinutes = elapsed / 60000;
        const newKwh = elapsedMinutes * 0.5;
        
        setCurrentSession(prev => ({
          ...prev,
          elapsedTime: elapsed,
          kWh: newKwh,
        }));
        
        if (newKwh >= currentSession.kwhLimit) {
          if (currentSession.stationId) {
            stopCharging(currentSession.stationId);
          }
          toast.info('Charging complete! Maximum kWh reached.');
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCharging, currentSession.startTime, currentSession.kwhLimit]);
  
  const startCharging = useCallback((stationId: number, kwhLimit: number) => {
    setIsCharging(true);
    setCurrentSession({
      stationId,
      startTime: Date.now(),
      elapsedTime: 0,
      kWh: 0,
      kwhLimit,
    });
    updateConnectorStatus(stationId, stationId, 'Charging');
    toast.success('Charging started successfully');
  }, []);
  
  const stopCharging = useCallback((stationId: number) => {
    setIsCharging(false);
    updateConnectorStatus(stationId, stationId, 'Available');
    toast.info('Charging stopped');
    
    setCurrentSession({
      stationId: null,
      startTime: null,
      elapsedTime: 0,
      kWh: 0,
      kwhLimit: 20,
    });
  }, []);
  
  return (
    <ChargingContext.Provider 
      value={{ 
        startCharging,
        stopCharging,
        isCharging,
        currentSession
      }}
    >
      {children}
    </ChargingContext.Provider>
  );
};

export const useCharging = () => useContext(ChargingContext);
