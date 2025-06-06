import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, Zap, User, PlugZap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/api/AuthContext";

export function NavBar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Return empty fragment if not authenticated
  if (!isAuthenticated) return null;

  // Navigation items
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Chargers", path: "/chargers", icon: MapPin },
    { name: "History", path: "/history", icon: PlugZap },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-600">
      <div className="container mx-auto px-2">
        <div className="grid h-full grid-cols-4 mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium transition-colors",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
