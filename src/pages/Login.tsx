import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    farmerName: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample farmer accounts for development
  const sampleAccounts = [
    { name: "Rakesh Kumar", password: "TestPass@123" },
    { name: "farmer_anu", password: "TestPass@123" },
    { name: "farmer_lee", password: "TestPass@123" },  
    { name: "farmer_maya", password: "TestPass@123" },
    { name: "farmer_john", password: "TestPass@123" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check against sample accounts
    const account = sampleAccounts.find(
      acc => acc.name === formData.farmerName && acc.password === formData.password
    );

    setTimeout(() => {
      if (account) {
        toast({
          title: "Login successful!",
          description: `Welcome back, ${formData.farmerName}`,
        });
        // Store farmer info in localStorage for demo
        localStorage.setItem("currentFarmer", formData.farmerName);
        navigate("/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Try sample accounts: farmer_raj, farmer_anu, etc.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md shadow-farm-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
            <p className="text-muted-foreground">Login to access your farm dashboard</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farmerName">Farmer Name</Label>
                <Input
                  id="farmerName"
                  name="farmerName"
                  type="text"
                  required
                  value={formData.farmerName}
                  onChange={handleChange}
                  placeholder="Enter your farmer name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                variant="hero"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                Demo accounts: farmer_raj, farmer_anu, farmer_lee, farmer_maya, farmer_john<br/>
                Password: TestPass@123
              </p>
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
