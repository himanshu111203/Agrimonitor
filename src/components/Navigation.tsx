import { Button } from "@/components/ui/button";
import { Home, Leaf, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationProps {
  onLogout?: () => void;
  showHomeButton?: boolean;
  showLogout?: boolean;
}

const Navigation = ({ onLogout, showHomeButton = true, showLogout = false }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    onLogout?.();
    navigate("/");
  };

  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">AgriMonitor</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {showHomeButton && location.pathname !== "/" && (
            <Button variant="ghost" onClick={handleHome} className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          )}
          
          {showLogout && (
            <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
