
import React, { useState } from "react";
import { QrCode, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const QrScanner = () => {
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    // In a real app, we would access the device camera here
    // For this demo, we'll simulate a scan after 3 seconds
    setTimeout(() => {
      const mockStationId = Math.floor(Math.random() * 5) + 1;
      handleScanResult(`station_${mockStationId}`);
    }, 3000);
  };

  const handleScanResult = (result: string) => {
    setScanning(false);
    if (result.startsWith("station_")) {
      const stationId = result.split("_")[1];
      toast.success(`QR code detected for Station #${stationId}`);
      // In a real app, we could navigate to the station detail page
      // window.location.href = `/chargers/${stationId}`;
    } else {
      toast.error("Invalid QR code format");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Scan & Charge</h2>
              <p className="text-sm opacity-90">
                Scan a station QR code to start charging
              </p>
            </div>
            <QrCode className="h-8 w-8" />
          </div>
        </div>
        <div className="p-4">
          {scanning ? (
            <div className="text-center py-8 flex flex-col items-center">
              <div className="w-48 h-48 rounded-lg bg-muted/30 flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute w-full h-1 bg-primary animate-scan"></div>
                <QrCode className="h-24 w-24 opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">Scanning...</p>
              <Button variant="outline" onClick={() => setScanning(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={startScan} className="w-full mt-2 gap-2">
              <Scan className="h-4 w-4" />
              Scan QR Code
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
