
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Zap, Clock, ChevronRight } from 'lucide-react';
import { getUserSessions } from '@/lib/mockData';
import { ChargingSession } from '@/lib/types';

const History = () => {
  const { user, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChargingSession[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      const userSessions = getUserSessions(user.id);
      setSessions(userSessions);
      setFilteredSessions(userSessions);
    }
  }, [user]);
  
  useEffect(() => {
    if (!dateFilter) {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter(session => 
        session.date.includes(dateFilter)
      );
      setFilteredSessions(filtered);
    }
  }, [dateFilter, sessions]);
  
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Charging History</h1>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date-filter">Filter by date</Label>
        <Input
          id="date-filter"
          type="date"
          placeholder="Filter by date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map(session => (
            <Link to={`/history/${session.id}`} key={session.id}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 grid gap-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">{session.station}</h2>
                    <div className="flex items-center space-x-1">
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {session.date}
                      </p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Zap className="h-4 w-4 mr-1 text-primary" />
                      <span>{session.kWh} kWh</span>
                    </div>
                    <div className="flex items-center text-sm justify-end">
                      <span className="font-medium">${(session.kWh * 0.35).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {dateFilter ? 'No charging sessions found for this date' : 'No charging history available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
