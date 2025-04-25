
import React from 'react';
import { NavBar } from './NavBar';
import { useAuth } from '@/contexts/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <NavBar />}
      <main className={`flex-1 container mx-auto px-4 py-6 ${isAuthenticated ? 'pb-20 md:pt-20 md:pb-6' : ''}`}>
        {children}
      </main>
    </div>
  );
}
