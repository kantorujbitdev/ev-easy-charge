
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { ChargingContextType } from '@/lib/types';
import { updateChargerStatus } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';

// Default context value
const ChargingContext = createContext<ChargingContextType>({
  startCharging: () => {},
  stopCharging: () => {},
  isCharging: false,
  currentSession: {
    stationId: null,
    startTime: null,
    elapsedTime: 0,
    kWh: 0,
  },
});

export const ChargingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCharging, setIsCharging] = useState(false);
  const [currentSession, setCurrentSession] = useState({
    stationId: null as number | null,
    startTime: null as number | null,
    elapsedTime: 0,
    kWh: 0,
  });
  
  const MAX_KWH = 20; // Auto stop at 20kWh
  
  // Tick function to update charging progress
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isCharging && currentSession.startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - currentSession.startTime!;
        const elapsedMinutes = elapsed / 60000; // Convert to minutes
        
        // Simulate charging rate of 0.5kWh per minute (30kWh per hour)
        const newKwh = elapsedMinutes * 0.5;
        
        setCurrentSession(prev => ({
          ...prev,
          elapsedTime: elapsed,
          kWh: newKwh,
        }));
        
        // Auto-stop when reaching the limit
        if (newKwh >= MAX_KWH) {
          stopCharging(currentSession.stationId!);
          toast.info('Charging complete! Maximum kWh reached.');
        }
      }, 1000); // Update every second
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCharging, currentSession.startTime]);
  
  const startCharging = useCallback((stationId: number) => {
    setIsCharging(true);
    setCurrentSession({
      stationId,
      startTime: Date.now(),
      elapsedTime: 0,
      kWh: 0,
    });
    updateChargerStatus(stationId, 'Charging');
    toast.success('Charging started successfully');
  }, []);
  
  const stopCharging = useCallback((stationId: number) => {
    setIsCharging(false);
    updateChargerStatus(stationId, 'Available');
    toast.info('Charging stopped');
    
    // Reset session data
    setCurrentSession({
      stationId: null,
      startTime: null,
      elapsedTime: 0,
      kWh: 0,
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
