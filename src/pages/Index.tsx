import { useNavigate } from "react-router-dom";
import { useCharging } from "@/contexts/ChargingContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Zap, Clock } from "lucide-react";
import { chargers } from "@/lib/mockData";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import NewsPage from "./NewsPage";
import { useAuth } from "@/contexts/api/AuthContext";

const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const AdBanner = ({
  title,
  description,
  imageBg,
}: {
  title: string;
  description: string;
  imageBg: string;
}) => (
  <Card className="mb-6 overflow-hidden">
    <div
      className={`h-32 ${imageBg} bg-cover bg-center flex items-center justify-center`}
    >
      <div className="bg-black/50 w-full h-full flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-xl font-bold mb-1">{title}</h2>
        <p className="text-sm text-center">{description}</p>
      </div>
    </div>
  </Card>
);

const Index = () => {
  const { user } = useAuth();
  const { isCharging, currentSession } = useCharging();
  const navigate = useNavigate();
  console.log("user: " + user);

  // Count available connectors across all stations
  const availableChargers = chargers.reduce((count, station) => {
    return (
      count + station.connectors.filter((c) => c.status === "Available").length
    );
  }, 0);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">{user.vehicle}</p>
      </section>

      <NewsPage />

      {/* Advertising Banner */}
      <AdBanner
        title="Save 20% on Charging Costs"
        description="Subscribe to our Premium Plan and save on every charge"
        imageBg="bg-gradient-to-r from-blue-500 to-purple-600"
      />

      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-pointer">
            <AdBanner
              title="New Stations Added!"
              description="Check out our newest charging locations"
              imageBg="bg-gradient-to-r from-green-500 to-teal-500"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-2">
            <h4 className="font-medium">Expanded Network</h4>
            <p className="text-sm text-muted-foreground">
              We've added 15 new charging stations across the city. Find the one
              closest to you!
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>

      {isCharging ? (
        <Card className="border-primary shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Currently Charging</span>
              <span className="status-badge status-charging">Active</span>
            </CardTitle>
            <CardDescription>
              {chargers.find((c) => c.id === currentSession.stationId)?.name ||
                "Station"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                <Zap className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm text-muted-foreground">Energy</span>
                <span className="text-xl font-semibold">
                  {currentSession.kWh.toFixed(2)} kWh
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-xl font-semibold">
                  {formatDuration(currentSession.elapsedTime)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Charging Progress</span>
                <span>
                  {Math.min(100, (currentSession.kWh / 20) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress
                value={Math.min(100, (currentSession.kWh / 20) * 100)}
                className="h-2"
              />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(`/chargers/${currentSession.stationId}`)}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-muted shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Start Charging</CardTitle>
            <CardDescription>
              Find an available charging station
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <div>
                  <p className="font-medium">Available Stations</p>
                  <p className="text-sm text-muted-foreground">
                    {availableChargers} stations ready
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={() => navigate("/chargers")}>
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Charging History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              View your recent charging sessions
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/history")}
            >
              View History
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage your account settings
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
