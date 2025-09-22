import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DataPoint {
  date: string;
  value: number;
  timestamp: number;
}

interface SpectralChartProps {
  title: string;
  data: DataPoint[];
  color: string;
  status: string;
  description: string;
  unit?: string;
}

const SpectralChart: React.FC<SpectralChartProps> = ({ 
  title, 
  data, 
  color, 
  status, 
  description, 
  unit = "" 
}) => {
  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatYAxisTick = (value: number) => {
    return value.toFixed(2);
  };

  const formatXAxisTick = (timestamp: number) => {
    const date = new Date(timestamp);
    // Determine format based on data span
    if (data.length <= 12) {
      // Monthly or fewer points - show month/year
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } else if (data.length <= 31) {
      // Daily points - show day/month
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } else {
      // Weekly points - show week number
      return `W${Math.ceil(date.getDate() / 7)}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'default';
      case 'good': return 'secondary';
      case 'normal': return 'outline';
      case 'monitoring': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="shadow-farm-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant={getStatusColor(status)}>{status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatXAxisTick}
                className="text-xs"
              />
              <YAxis 
                tickFormatter={formatYAxisTick}
                className="text-xs"
              />
              <Tooltip 
                labelFormatter={formatTooltipLabel}
                formatter={(value: number) => [`${value.toFixed(3)}${unit}`, title]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {data[data.length - 1]?.value.toFixed(3)}{unit}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpectralChart;
