import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Farm {
  name: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  startDate: string;
  endDate: string;
}

interface CreateFarmFormProps {
  onSubmit: (farm: Farm) => void;
  onCancel: () => void;
}

const CreateFarmForm = ({ onSubmit, onCancel }: CreateFarmFormProps) => {
  const [formData, setFormData] = useState<Farm>({
    name: "",
    minLat: 0,
    maxLat: 0,
    minLng: 0,
    maxLng: 0,
    startDate: "2020-01-01",
    endDate: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Farm name required",
        description: "Please enter a name for your farm",
        variant: "destructive",
      });
      return;
    }

    if (formData.minLat >= formData.maxLat || formData.minLng >= formData.maxLng) {
      toast({
        title: "Invalid coordinates",
        description: "Please ensure min values are less than max values",
        variant: "destructive",
      });
      return;
    }

    const startYear = new Date(formData.startDate).getFullYear();
    if (startYear < 2000) {
      toast({
        title: "Invalid start date",
        description: "Start date must be from 2000 onward",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Farm Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter farm name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minLat">Min Latitude</Label>
          <Input
            id="minLat"
            name="minLat"
            type="number"
            step="any"
            required
            value={formData.minLat}
            onChange={handleChange}
            placeholder="e.g., 40.7128"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxLat">Max Latitude</Label>
          <Input
            id="maxLat"
            name="maxLat"
            type="number"
            step="any"
            required
            value={formData.maxLat}
            onChange={handleChange}
            placeholder="e.g., 40.7628"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minLng">Min Longitude</Label>
          <Input
            id="minLng"
            name="minLng"
            type="number"
            step="any"
            required
            value={formData.minLng}
            onChange={handleChange}
            placeholder="e.g., -74.0060"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxLng">Max Longitude</Label>
          <Input
            id="maxLng"
            name="maxLng"
            type="number"
            step="any"
            required
            value={formData.maxLng}
            onChange={handleChange}
            placeholder="e.g., -73.9560"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            required
            value={formData.startDate}
            onChange={handleChange}
            min="2000-01-01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            required
            value={formData.endDate}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          variant="hero"
          className="flex-1"
        >
          {isLoading ? "Creating Farm..." : "Create Farm"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateFarmForm;
