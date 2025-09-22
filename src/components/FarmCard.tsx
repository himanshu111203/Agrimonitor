import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Activity } from "lucide-react";

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

interface FarmCardProps {
  farm: Farm;
  onClick: () => void;
}

const FarmCard = ({ farm, onClick }: FarmCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getHealthStatus = () => {
    // Mock health status based on farm creation time
    const statuses = ["Healthy", "Monitoring", "Alert"];
    const index = parseInt(farm.id) % statuses.length;
    return statuses[index];
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-farm-healthy text-white";
      case "Monitoring":
        return "bg-farm-warning text-white";
      case "Alert":
        return "bg-farm-critical text-white";
      default:
        return "bg-primary text-white";
    }
  };

  const centerLat = (farm.minLat + farm.maxLat) / 2;
  const centerLng = (farm.minLng + farm.maxLng) / 2;

  return (
    <Card 
      className="cursor-pointer hover:shadow-farm-card transition-smooth hover:scale-105 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {farm.name}
          </CardTitle>
          <Badge className={getHealthColor(getHealthStatus())}>
            <Activity className="h-3 w-3 mr-1" />
            {getHealthStatus()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Center: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(farm.startDate)} - {formatDate(farm.endDate)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          <div className="bg-muted p-2 rounded">
            <p className="text-muted-foreground">Lat Range</p>
            <p className="font-medium">{farm.minLat.toFixed(4)} to {farm.maxLat.toFixed(4)}</p>
          </div>
          <div className="bg-muted p-2 rounded">
            <p className="text-muted-foreground">Lng Range</p>
            <p className="font-medium">{farm.minLng.toFixed(4)} to {farm.maxLng.toFixed(4)}</p>
          </div>
        </div>

        <div className="pt-2 text-xs text-muted-foreground">
          Created: {formatDate(farm.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmCard;
