
import React from 'react';
import { Battery, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChargerConnector } from '@/lib/types';
import { useCharging } from '@/contexts/ChargingContext';
import { toast } from 'sonner';

const chargingSchema = z.object({
  kwhLimit: z.coerce.number()
    .min(0, 'Must be greater than 0')
    .max(100, 'Must not exceed 100 kWh'),
});

type ConnectorCardProps = {
  connector: ChargerConnector;
};

const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const ConnectorCard = ({ connector }: ConnectorCardProps) => {
  const { isCharging, startCharging, stopCharging, currentSession } = useCharging();
  const form = useForm<z.infer<typeof chargingSchema>>({
    resolver: zodResolver(chargingSchema),
    defaultValues: {
      kwhLimit: 20,
    },
  });

  const isCurrentConnector = isCharging && 
    currentSession.stationId === connector.stationId && 
    currentSession.connectorId === connector.id;

  const handleChargingAction = () => {
    if (isCurrentConnector) {
      stopCharging(connector.stationId, connector.id);
    } else if (connector.status === 'Available') {
      const kwhLimit = form.getValues('kwhLimit');
      if (kwhLimit) {
        startCharging(connector.stationId, connector.id, kwhLimit);
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
    <Card className="mb-4">
      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-between items-start">
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="flex items-center">
              <Battery className="h-4 w-4 mr-2" />
              <span>{connector.type}</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              <span>{connector.power} kW</span>
            </div>
          </div>
          {getStatusBadge(connector.status)}
        </div>

        {isCurrentConnector && (
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground">Energy</span>
                <span className="text-2xl font-bold text-primary">
                  {currentSession.kWh.toFixed(2)} kWh
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-2xl font-bold text-primary">
                  {formatDuration(currentSession.elapsedTime)}
                </span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {Math.min(100, (currentSession.kWh / currentSession.kwhLimit) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress 
                value={Math.min(100, (currentSession.kWh / currentSession.kwhLimit) * 100)} 
                className="h-2" 
              />
            </div>
          </div>
        )}

        {!isCurrentConnector && connector.status === 'Available' && (
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

        <Button
          className={`w-full ${isCurrentConnector ? 'bg-destructive hover:bg-destructive/90' : ''}`}
          disabled={connector.status === 'Out of Service' || (isCharging && !isCurrentConnector)}
          onClick={handleChargingAction}
        >
          {isCurrentConnector 
            ? 'Stop Charging'
            : connector.status === 'Available'
              ? 'Start Charging'
              : connector.status === 'Charging'
                ? 'In Use'
                : 'Out of Service'
          }
        </Button>
      </CardContent>
    </Card>
  );
};
