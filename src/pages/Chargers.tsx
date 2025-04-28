
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, Battery, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { chargers } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';

const Chargers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  const filteredChargers = chargers.filter(
    charger => 
      charger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charger.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (charger.address && charger.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  // Helper function to determine the overall station status based on connectors
  const getStationStatus = (charger: typeof chargers[0]): 'Available' | 'Charging' | 'Out of Service' => {
    if (!charger.connectors || charger.connectors.length === 0) return 'Out of Service';
    
    if (charger.connectors.some(c => c.status === 'Available')) return 'Available';
    if (charger.connectors.some(c => c.status === 'Charging')) return 'Charging';
    
    return 'Out of Service';
  };

  // Helper function to get the highest power of the station's connectors
  const getStationPower = (charger: typeof chargers[0]): number => {
    if (!charger.connectors || charger.connectors.length === 0) return 0;
    
    return Math.max(...charger.connectors.map(c => c.power));
  };

  // Helper function to get connector types as a comma-separated string
  const getConnectorTypes = (charger: typeof chargers[0]): string => {
    if (!charger.connectors || charger.connectors.length === 0) return 'None';
    
    const types = [...new Set(charger.connectors.map(c => c.type))];
    return types.join(', ');
  };

  if (!isAuthenticated) {
    return <div>Please log in to view chargers.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Charging Stations</h1>
      </div>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Search stations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="grid gap-4">
        {filteredChargers.length > 0 ? (
          filteredChargers.map(charger => (
            <Card key={charger.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-lg font-medium">{charger.name}</h2>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {charger.location}
                      </p>
                    </div>
                    {getStatusBadge(getStationStatus(charger))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 mr-1 text-primary" />
                      {getStationPower(charger)} kW
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Battery className="h-4 w-4 mr-1 text-primary" />
                      {getConnectorTypes(charger)}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-4 py-2.5">
                <div className="flex justify-end items-center w-full">
                  <Button 
                    size="sm"
                    variant="ghost"
                    asChild
                    className="text-primary"
                  >
                    <Link to={`/chargers/${charger.id}`}>
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No charging stations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chargers;
