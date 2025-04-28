import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Battery,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ChargingSession } from "@/lib/types";
import { getSessionById } from "@/lib/mockData";

const HistoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<ChargingSession | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const sessionId = parseInt(id, 10);
      const foundSession = getSessionById(sessionId);

      if (foundSession) {
        setSession(foundSession);
      } else {
        navigate("/history");
      }
    }
  }, [id, navigate]);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  const cost = (session.kWh * 0.35).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/history")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Charging Details</h1>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">{session.station}</h2>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              Location details (if available)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground flex items-center mb-1">
                <Calendar className="h-4 w-4 mr-1" /> Date
              </span>
              <span className="font-medium">{session.date}</span>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground flex items-center mb-1">
                <Clock className="h-4 w-4 mr-1" /> Duration
              </span>
              <span className="font-medium">{session.duration}</span>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground flex items-center mb-1">
                <Zap className="h-4 w-4 mr-1" /> Energy
              </span>
              <span className="font-medium">{session.kWh} kWh</span>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground flex items-center mb-1">
                <CreditCard className="h-4 w-4 mr-1" /> Cost
              </span>
              <span className="font-medium">${cost}</span>
            </div>
          </div>

          {session.startTime && session.endTime && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Start Time
                  </span>
                  <p className="font-medium">{session.startTime}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">
                    End Time
                  </span>
                  <p className="font-medium">{session.endTime}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-medium mb-2">Charging Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Energy consumed</span>
                <span>{session.kWh} kWh</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate per kWh</span>
                <span>$0.35</span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t">
                <span>Total</span>
                <span>${cost}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryDetail;
