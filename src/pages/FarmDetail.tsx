import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import SpectralChart from "@/components/SpectralChart";
import SensorChart from "@/components/SensorChart";
import { useToast } from "@/hooks/use-toast";
import { generateSpectralTimeSeries, generateSensorTimeSeries } from "@/utils/dateResolution";
import { 
  ArrowLeft, 
  Satellite, 
  TrendingUp, 
  AlertTriangle, 
  Thermometer,
  Droplets,
  Leaf,
  Activity
} from "lucide-react";

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

const FarmDetail = () => {
  const { farmId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [spectralData, setSpectralData] = useState<any>({});
  const [sensorData, setSensorData] = useState<any>({});

  useEffect(() => {
    const farmer = localStorage.getItem("currentFarmer");
    if (!farmer) {
      navigate("/login");
      return;
    }

    // Get farm data from location state or localStorage
    let farmData = location.state?.farm;
    if (!farmData && farmId) {
      const farms = JSON.parse(localStorage.getItem(`farms_${farmer}`) || "[]");
      farmData = farms.find((f: Farm) => f.id === farmId);
    }

    if (farmData) {
      setFarm(farmData);
      // Simulate ML model API call
      toast({
        title: "Analyzing farm data...",
        description: "ML model is processing satellite imagery and sensor data",
      });
      
      // Generate time-series data based on farm date range
      const startDate = new Date(farmData.startDate);
      const endDate = new Date(farmData.endDate);
      
      setTimeout(() => {
        // Generate spectral analysis time-series data
        const spectralIndices = ['NDVI', 'NDWI', 'SAVI', 'WBI', 'RE-NDVI'];
        const newSpectralData: any = {};
        
        spectralIndices.forEach(index => {
          newSpectralData[index] = generateSpectralTimeSeries(startDate, endDate, index);
        });
        
        // Generate sensor data time-series
        const sensorTypes = ['Soil Moisture', 'Temperature', 'Humidity', 'Leaf Wetness'];
        const newSensorData: any = {};
        
        sensorTypes.forEach(sensor => {
          newSensorData[sensor] = generateSensorTimeSeries(startDate, endDate, sensor);
        });
        
        setSpectralData(newSpectralData);
        setSensorData(newSensorData);
        setLoading(false);
        
        toast({
          title: "Analysis complete!",
          description: "Farm insights are now available",
        });
      }, 2000);
    } else {
      navigate("/dashboard");
    }
  }, [farmId, location.state, navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("currentFarmer");
    navigate("/");
  };

  if (!farm) {
    return <div>Loading...</div>;
  }

  // Static spectral index configurations
  const spectralConfig = {
    'NDVI': { color: '#22c55e', status: 'Healthy', description: 'Vegetation is thriving', scale: 'ndvi' },
    'NDWI': { color: '#3b82f6', status: 'Normal', description: 'Adequate water content', scale: 'water' },
    'SAVI': { color: '#eab308', status: 'Good', description: 'Soil-adjusted vegetation index optimal', scale: 'default' },
    'WBI': { color: '#f97316', status: 'Monitoring', description: 'Water band index needs attention', scale: 'water' },
    'RE-NDVI': { color: '#10b981', status: 'Healthy', description: 'Red-edge NDVI shows healthy vegetation', scale: 'ndvi' }
  };

  // Static sensor configurations
  const sensorConfig = {
    'Soil Moisture': { icon: Droplets, color: '#3b82f6', unit: '%' },
    'Temperature': { icon: Thermometer, color: '#f97316', unit: '°C' },
    'Humidity': { icon: Leaf, color: '#22c55e', unit: '%' },
    'Leaf Wetness': { icon: Activity, color: '#06b6d4', unit: '%' }
  };

  const mockAlerts = [
    { severity: "High", type: "Pest Risk", message: "Unusual spectral patterns detected - potential pest activity in southern quadrant" },
    { severity: "Medium", type: "Irrigation Alert", message: "WBI indicates potential water stress in northern section" },
    { severity: "Low", type: "Growth Monitor", message: "NDVI trends suggest optimal growth conditions" },
  ];

  // Calculate farm area in m² and acres
  const calculateFarmArea = () => {
    if (!farm) return { sqMeters: 0, acres: 0 };
    
    // Approximate calculation using Haversine formula for small areas
    const latDiff = farm.maxLat - farm.minLat;
    const lngDiff = farm.maxLng - farm.minLng;
    const avgLat = (farm.minLat + farm.maxLat) / 2;
    
    // Convert to meters (approximate)
    const latMeters = latDiff * 111000; // 1 degree ≈ 111km
    const lngMeters = lngDiff * 111000 * Math.cos(avgLat * Math.PI / 180);
    
    const sqMeters = Math.abs(latMeters * lngMeters);
    const acres = sqMeters * 0.000247105; // 1 m² = 0.000247105 acres
    
    return { sqMeters, acres };
  };

  const { sqMeters, acres } = calculateFarmArea();

  return (
    <div className="min-h-screen bg-background">
      <Navigation showLogout onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">{farm.name}</h1>
            <p className="text-muted-foreground">
              Farm Analysis - {new Date(farm.startDate).toLocaleDateString()} to {new Date(farm.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {loading ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Processing Farm Data</h3>
              <p className="text-muted-foreground">ML model is analyzing satellite imagery and sensor data...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Risk Insights Section */}
            <Card className="shadow-farm-card border-l-4 border-l-farm-warning">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-farm-warning" />
                  <span>Risk Insights & Anomalies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border-l-4 border-l-primary bg-muted/50 rounded-r-lg">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === "High" ? "text-farm-critical" :
                      alert.severity === "Medium" ? "text-farm-warning" :
                      "text-primary"
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={alert.severity === "High" ? "destructive" : "secondary"}>
                          {alert.severity}
                        </Badge>
                        <span className="font-semibold">{alert.type}</span>
                      </div>
                      <p className="text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Farm Area Section */}
            <Card className="shadow-farm-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Satellite className="h-5 w-5 text-primary" />
                  <span>Farm Area</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {sqMeters.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Square Meters (m²)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {acres.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Acres</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="spectral" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="spectral">Spectral Analysis</TabsTrigger>
                <TabsTrigger value="sensors">Sensor Data</TabsTrigger>
              </TabsList>
            
              <TabsContent value="spectral" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(spectralConfig).map(([index, config]) => {
                    const data = spectralData[index] || [];
                    return (
                      <SpectralChart
                        key={index}
                        title={index}
                        data={data}
                        color={config.color}
                        status={config.status}
                        description={config.description}
                      />
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="sensors" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(sensorConfig).map(([sensor, config]) => {
                    const data = sensorData[sensor] || [];
                    return (
                      <SensorChart
                        key={sensor}
                        title={sensor}
                        data={data}
                        color={config.color}
                        icon={config.icon}
                        unit={config.unit}
                        chartType={sensor === 'Temperature' ? 'line' : 'area'}
                      />
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDetail;
