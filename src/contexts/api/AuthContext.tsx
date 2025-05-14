// src/contexts/api/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Tipe user sesuai respons API-mu
interface User {
  token: string;
  id: number;
  username: string;
  name: string;
  vehicle: string;
  licensePlate: string;
  email: string;
  phone: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  register: (
    username: string,
    password: string,
    name: string,
    vehicle: string,
    licensePlate: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast("Logged out");
    navigate("/login");
  };

  const register = async (
    username: string,
    password: string,
    name: string,
    vehicle: string,
    licensePlate: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          name,
          vehicle,
          licensePlate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Registration failed");
        return false;
      }

      const data = await response.json();
      toast.success("Account created successfully!");

      if (data.token) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }

      return true;
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Something went wrong");
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    logout,
    isAuthenticated: !!user,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
