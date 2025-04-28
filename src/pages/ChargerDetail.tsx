import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getChargerById } from "@/lib/mockData";
import { ChargerStation } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { ConnectorCard } from "@/components/ConnectorCard";

const ChargerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [charger, setCharger] = useState<ChargerStation | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const chargerId = parseInt(id || "0", 10);

  useEffect(() => {
    if (chargerId) {
      const foundCharger = getChargerById(chargerId);
      if (foundCharger) {
        setCharger(foundCharger);
      } else {
        navigate("/chargers");
      }
    }
  }, [chargerId, navigate]);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (!charger) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/chargers")}
        >
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
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Available Connectors</h2>
        {charger.connectors.map((connector) => (
          <ConnectorCard key={connector.id} connector={connector} />
        ))}
      </div>
    </div>
  );
};

export default ChargerDetail;
