
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, LogOut, Car } from 'lucide-react';
import { getUserSessions } from '@/lib/mockData';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }
  
  const userSessions = getUserSessions(user.id);
  const totalEnergy = userSessions.reduce((sum, session) => sum + session.kWh, 0);
  const sessionsCount = userSessions.length;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.profileImage} alt={user.name} />
          <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.username}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <User className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-muted-foreground w-24">Name:</span>
            <span>{user.name}</span>
          </div>
          
          <div className="flex items-center">
            <Car className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-muted-foreground w-24">Vehicle:</span>
            <span>{user.vehicle}</span>
          </div>
          
          {user.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-muted-foreground w-24">Email:</span>
              <span>{user.email}</span>
            </div>
          )}
          
          {user.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-muted-foreground w-24">Phone:</span>
              <span>{user.phone}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col p-4 bg-muted/50 rounded-lg items-center">
              <span className="text-2xl font-bold text-primary">{sessionsCount}</span>
              <span className="text-sm text-muted-foreground">Total Sessions</span>
            </div>
            <div className="flex flex-col p-4 bg-muted/50 rounded-lg items-center">
              <span className="text-2xl font-bold text-primary">{totalEnergy.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">Total Energy (kWh)</span>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="pt-4">
          <Button 
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
