
import React, { useEffect } from "react";
import { NavBar } from "./NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is not authenticated and not on login or register pages, redirect to login
    if (
      !user && 
      !isAuthenticated &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <main
        className={`flex-1 container mx-auto px-4 py-6 ${
          isAuthenticated ? "pb-20" : ""
        }`}
      >
        {children}
      </main>
      {isAuthenticated && <NavBar />}
    </div>
  );
}
