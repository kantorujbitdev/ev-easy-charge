import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChargingProvider } from "@/contexts/ChargingContext";
import { Layout } from "@/components/Layout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chargers from "./pages/Chargers";
import ChargerDetail from "./pages/ChargerDetail";
import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/api/AuthContext";

// Create a query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChargingProvider>
        <Toaster />
        <SonnerToaster />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Index />} />
                <Route path="/chargers" element={<Chargers />} />
                <Route path="/chargers/:id" element={<ChargerDetail />} />
                <Route path="/history" element={<History />} />
                <Route path="/history/:id" element={<HistoryDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </ChargingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
