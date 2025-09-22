import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DataPoint {
  date: string;
  value: number;
  timestamp: number;
}

interface SensorChartProps {
  title: string;
  data: DataPoint[];
  color: string;
  icon: LucideIcon;
  unit: string;
  chartType?: 'line' | 'area';
}

const SensorChart: React.FC<SensorChartProps> = ({ 
  title, 
  data, 
  color, 
  icon: Icon, 
  unit,
  chartType = 'area'
}) => {
  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatYAxisTick = (value: number) => {
    if (unit === '%') {
      return `${value.toFixed(0)}%`;
    } else if (unit === '°C') {
      return `${value.toFixed(1)}°C`;
    }
    return value.toFixed(1);
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
      // Weekly or hourly points - show abbreviated format
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' });
    }
  };

  const getCurrentValue = () => {
    const latest = data[data.length - 1]?.value || 0;
    if (unit === '%') {
      return `${latest.toFixed(0)}%`;
    } else if (unit === '°C') {
      return `${latest.toFixed(1)}°C`;
    }
    return `${latest.toFixed(1)}${unit}`;
  };

  const getMinMax = () => {
    const values = data.map(d => d.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length
    };
  };

  const { min, max, avg } = getMinMax();

  return (
    <Card className="shadow-farm-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5" style={{ color }} />
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color }}>
              {getCurrentValue()}
            </div>
            <div className="text-xs text-muted-foreground">Current</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart
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
                  formatter={(value: number) => [formatYAxisTick(value), title]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
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
                  formatter={(value: number) => [formatYAxisTick(value), title]}
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
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Statistics Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Min</div>
            <div className="font-semibold" style={{ color }}>
              {formatYAxisTick(min)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Avg</div>
            <div className="font-semibold" style={{ color }}>
              {formatYAxisTick(avg)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Max</div>
            <div className="font-semibold" style={{ color }}>
              {formatYAxisTick(max)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorChart;
