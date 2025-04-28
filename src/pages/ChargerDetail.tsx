
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Zap, Battery, Clock, ArrowLeft, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getChargerById } from '@/lib/mockData';
import { ChargerStation } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCharging } from '@/contexts/ChargingContext';
import { toast } from 'sonner';

const chargingSchema = z.object({
  kwhLimit: z.string()
    .transform(val => Number(val))
    .refine(val => val > 0, 'Must be greater than 0')
    .refine(val => val <= 100, 'Must not exceed 100 kWh'),
});

const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const ChargerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [charger, setCharger] = useState<ChargerStation | null>(null);
  const { isAuthenticated } = useAuth();
  const { isCharging, startCharging, stopCharging, currentSession } = useCharging();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof chargingSchema>>({
    resolver: zodResolver(chargingSchema),
    defaultValues: {
      kwhLimit: "20", // Changed to string to match the input type
    },
  });
  
  const chargerId = parseInt(id || '0', 10);
  const isCurrentCharger = isCharging && currentSession.stationId === chargerId;
  
  useEffect(() => {
    if (chargerId) {
      const foundCharger = getChargerById(chargerId);
      if (foundCharger) {
        setCharger(foundCharger);
      } else {
        navigate('/chargers');
      }
    }
  }, [chargerId, navigate]);
  
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  if (!charger) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  const handleChargingAction = () => {
    if (isCurrentCharger) {
      stopCharging(chargerId);
    } else if (charger.status === 'Available') {
      const kwhLimit = Number(form.getValues('kwhLimit')); // Convert to number when passing
      if (kwhLimit) {
        startCharging(chargerId, kwhLimit);
      } else {
        toast.error('Please enter a valid kWh limit');
      }
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <span className="status-badge status-available">Available</span>;
      case 'Charging':
        return <span className="status-badge status-charging">Charging</span>;
      case 'Out of Service':
        return <span className="status-badge status-unavailable">Out of Service</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/chargers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{charger.name}</h1>
      </div>
      
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {charger.address || charger.location}
              </p>
            </div>
            {getStatusBadge(charger.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground flex items-center mb-1">
                <Battery className="h-4 w-4 mr-1" /> Connector Type
              </span>
              <span className="font-medium">{charger.connectorType}</span>
            </div>
            <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground flex items-center mb-1">
                <Zap className="h-4 w-4 mr-1" /> Power Output
              </span>
              <span className="font-medium">{charger.power} kW</span>
            </div>
          </div>
          
          {isCurrentCharger && (
            <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground">Energy</span>
                  <span className="text-2xl font-bold text-primary">{currentSession.kWh.toFixed(2)} kWh</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-2xl font-bold text-primary">{formatDuration(currentSession.elapsedTime)}</span>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Charging Progress</span>
                  <span>{Math.min(100, (currentSession.kWh / currentSession.kwhLimit) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={Math.min(100, (currentSession.kWh / currentSession.kwhLimit) * 100)} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Auto-stop at {currentSession.kwhLimit}kWh
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  <span>
                    Total: {currentSession.kWh.toFixed(2)} kWh
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {!isCurrentCharger && charger.status === 'Available' && (
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="kwhLimit"
                  render={({ field }) => (
                    <FormItem>
                      <Label>kWh Limit</Label>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter kWh limit" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
          
          <div className="pt-2">
            <Button 
              className={`w-full ${isCurrentCharger ? 'bg-destructive hover:bg-destructive/90' : ''}`}
              disabled={charger.status === 'Out of Service' || (isCharging && !isCurrentCharger)}
              onClick={handleChargingAction}
            >
              {isCurrentCharger 
                ? 'Stop Charging' 
                : charger.status === 'Available' 
                  ? 'Start Charging' 
                  : charger.status === 'Charging' 
                    ? 'Currently In Use'
                    : 'Out of Service'
              }
            </Button>
            
            {isCharging && !isCurrentCharger && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                You are currently charging at another station
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChargerDetail;
