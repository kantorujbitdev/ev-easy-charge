// // src/contexts/api/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// // Tipe user sesuai respons API-mu
// interface User {
//   token: string;
//   id: number;
//   username: string;
//   name: string;
//   vehicle: string;
//   licensePlate: string;
//   email: string;
//   phone: string;
//   profileImage: string;
// }

// interface AuthContextType {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   logout: () => void;
//   isAuthenticated: boolean;
//   register: (
//     username: string,
//     password: string,
//     name: string,
//     vehicle: string,
//     licensePlate: string
//   ) => Promise<boolean>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     toast("Logged out");
//     navigate("/login");
//   };

//   const register = async (
//     username: string,
//     password: string,
//     name: string,
//     vehicle: string,
//     licensePlate: string
//   ): Promise<boolean> => {
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username,
//           password,
//           name,
//           vehicle,
//           licensePlate,
//         }),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         toast.error(data.message || "Registration failed");
//         return false;
//       }

//       const data = await response.json();
//       toast.success("Account created successfully!");

//       if (data.token) {
//         setUser(data);
//         localStorage.setItem("user", JSON.stringify(data));
//       }

//       return true;
//     } catch (error) {
//       console.error("Register error:", error);
//       toast.error("Something went wrong");
//       return false;
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     setUser,
//     logout,
//     isAuthenticated: !!user,
//     register,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

// src/contexts/api/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios";
import { goLogin, goLogout, ApiLoginResponse } from "@/lib/api_user";

export interface User {
  token: string;
  id: number;
  username: string;
  name: string;
  vehicle: string;
  license_plate: string;
  email: string;
  phone: string;
  profile_image: string;
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
    license_plate: string,
    email: string,
    phone: string,
    profile_image: string
  ) => Promise<boolean>;
  login: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // LOGIN
  const login = async (username: string, password: string): Promise<void> => {
    const data: ApiLoginResponse = await goLogin(username, password);
    // simpan token & user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser({ ...data.user, token: data.token });
    toast.success("Login successful");
    navigate("/");
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // LOGOUT
  const logout = async () => {
    if (!user || isLoggingOut) return;

    setIsLoggingOut(true); // aktifkan loading

    try {
      await goLogout(user.username);

      // Jika berhasil, hapus data dan redirect
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Berhasil logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Gagal logout. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false); // matikan loading
    }
  };

  // REGISTER
  const register = async (
    username: string,
    password: string,
    name: string,
    vehicle: string,
    license_plate: string,
    email: string,
    phone: string,
    profile_image: string
  ): Promise<boolean> => {
    try {
      const res = await api.post<ApiLoginResponse>("/auth/register", {
        username,
        password,
        name,
        vehicle,
        license_plate,
        email,
        phone,
        profile_image,
      });
      const data = res.data;
      toast.success("Account created successfully!");

      // jika server langsung return token + user
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser({ ...data.user, token: data.token });
      }
      return true;
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    logout,
    isAuthenticated: !!user,
    register,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
