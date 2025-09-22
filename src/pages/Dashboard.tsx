import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import CreateFarmForm from "@/components/CreateFarmForm";
import FarmCard from "@/components/FarmCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Plus, Tractor } from "lucide-react";

interface Farm {
  id: string;
  name: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const Dashboard = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentFarmer, setCurrentFarmer] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const farmer = localStorage.getItem("currentFarmer");
    if (!farmer) {
      navigate("/login");
      return;
    }
    setCurrentFarmer(farmer);
    
    // Load farms from localStorage
    const storedFarms = localStorage.getItem(`farms_${farmer}`);
    if (storedFarms) {
      setFarms(JSON.parse(storedFarms));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentFarmer");
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
  };

  const handleCreateFarm = (farmData: Omit<Farm, "id" | "createdAt">) => {
    const newFarm: Farm = {
      ...farmData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedFarms = [...farms, newFarm];
    setFarms(updatedFarms);
    localStorage.setItem(`farms_${currentFarmer}`, JSON.stringify(updatedFarms));
    setShowCreateForm(false);
    
    toast({
      title: "Farm created successfully!",
      description: `${farmData.name} has been added to your dashboard`,
    });

    // Simulate ML model API call
    toast({
      title: "Processing farm data...",
      description: "ML model is analyzing satellite data for your farm location",
    });
  };

  const handleFarmClick = (farm: Farm) => {
    navigate(`/farm/${farm.id}`, { state: { farm } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation showLogout onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {currentFarmer}
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your farms with AI-powered insights
            </p>
          </div>
          
          <Button 
            onClick={() => setShowCreateForm(true)}
            variant="hero"
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Farm</span>
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8 shadow-farm-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tractor className="h-5 w-5 text-primary" />
                <span>Create New Farm</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CreateFarmForm 
                onSubmit={handleCreateFarm}
                onCancel={() => setShowCreateForm(false)}
              />
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Your Farms</h2>
          
          {farms.length === 0 ? (
            <Card className="text-center py-12 shadow-card">
              <CardContent>
                <Tractor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  There are no farms
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first farm to begin monitoring
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  variant="hero"
                  className="flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Farm</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm) => (
                <FarmCard 
                  key={farm.id}
                  farm={farm}
                  onClick={() => handleFarmClick(farm)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
