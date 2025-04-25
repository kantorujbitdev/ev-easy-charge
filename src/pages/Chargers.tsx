
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

  // Filter stations based on search term
  const filteredChargers = chargers.filter(
    charger => 
      charger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charger.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (charger.address && charger.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper function to render the correct status badge
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
                    {getStatusBadge(charger.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 mr-1 text-primary" />
                      {charger.power} kW
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Battery className="h-4 w-4 mr-1 text-primary" />
                      {charger.connectorType}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 px-4 py-2.5">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm font-medium">${charger.price}/kWh</span>
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
