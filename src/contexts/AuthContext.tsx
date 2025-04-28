
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { findUserByUsername, registerNewUser } from '@/lib/mockData';
import { toast } from 'sonner';

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('ev_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('ev_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call with 500ms delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = findUserByUsername(username);
    
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('ev_user', JSON.stringify(foundUser));
      toast.success('Successfully logged in');
      return true;
    } else {
      toast.error('Invalid username or password');
      return false;
    }
  };
  
  const register = async (username: string, password: string, name: string, vehicle: string): Promise<boolean> => {
    // Simulate API call with 500ms delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = findUserByUsername(username);
    
    if (existingUser) {
      toast.error('Username already exists');
      return false;
    }
    
    try {
      const newUser = await registerNewUser(username, password, name, vehicle);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('ev_user', JSON.stringify(newUser));
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      toast.error('Failed to create account');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ev_user');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
