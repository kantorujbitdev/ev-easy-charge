
import React, { useEffect } from "react";
import { NavBar } from "./NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a user stored in localStorage but not in the auth context
    const storedUser = localStorage.getItem('ev_user');
    
    // If user is not authenticated and not on login or register pages, redirect to login
    if (
      !isAuthenticated &&
      !storedUser &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  // Determine whether to show the navbar based on authentication state
  // Only show navbar if user is authenticated (from context) or if there's a user in localStorage
  const showNavBar = isAuthenticated || localStorage.getItem('ev_user') !== null;

  return (
    <div className="min-h-screen flex flex-col">
      <main
        className={`flex-1 container mx-auto px-4 py-6 ${
          showNavBar ? "pb-20" : ""
        }`}
      >
        {children}
      </main>
      {showNavBar && <NavBar />}
    </div>
  );
}
