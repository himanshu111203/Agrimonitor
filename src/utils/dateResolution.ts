import { differenceInDays, differenceInMonths, differenceInYears, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DataPoint {
  date: string;
  value: number;
  timestamp: number;
}

export type Resolution = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const generateDatePoints = (startDate: Date, endDate: Date): Date[] => {
  // Always generate exactly 5 evenly spaced points
  const start = startDate.getTime();
  const end = endDate.getTime();
  const interval = (end - start) / 4; // 4 intervals for 5 points
  
  const points: Date[] = [];
  for (let i = 0; i < 5; i++) {
    points.push(new Date(start + (interval * i)));
  }
  
  return points;
};

export const generateMockTimeSeries = (
  startDate: Date, 
  endDate: Date, 
  baseValue: number,
  variance: number = 0.2,
  trend: number = 0,
  seasonality: boolean = false
): DataPoint[] => {
  const datePoints = generateDatePoints(startDate, endDate);
  
  return datePoints.map((date, index) => {
    let value = baseValue;
    
    // Add trend
    value += (trend * index) / datePoints.length;
    
    // Add seasonality (for longer periods)
    if (seasonality && datePoints.length > 12) {
      const seasonalPhase = (index / datePoints.length) * 2 * Math.PI;
      value += (baseValue * 0.1) * Math.sin(seasonalPhase);
    }
    
    // Add random variance
    value += (Math.random() - 0.5) * variance * baseValue;
    
    // Ensure value stays within reasonable bounds
    value = Math.max(0, Math.min(value, baseValue * 2));
    
    return {
      date: date.toISOString().split('T')[0],
      value: value,
      timestamp: date.getTime()
    };
  });
};

export const generateSpectralTimeSeries = (startDate: Date, endDate: Date, indexType: string): DataPoint[] => {
  const configs = {
    'NDVI': { base: 0.75, variance: 0.15, trend: 0.02, seasonality: true },
    'NDWI': { base: 0.45, variance: 0.12, trend: -0.01, seasonality: false },
    'SAVI': { base: 0.68, variance: 0.10, trend: 0.01, seasonality: true },
    'WBI': { base: 1.12, variance: 0.20, trend: -0.03, seasonality: false },
    'RE-NDVI': { base: 0.82, variance: 0.18, trend: 0.015, seasonality: true }
  };
  
  const config = configs[indexType as keyof typeof configs] || configs.NDVI;
  
  return generateMockTimeSeries(
    startDate, 
    endDate, 
    config.base, 
    config.variance, 
    config.trend, 
    config.seasonality
  );
};

export const generateSensorTimeSeries = (startDate: Date, endDate: Date, sensorType: string): DataPoint[] => {
  const configs = {
    'Soil Moisture': { base: 68, variance: 8, trend: -2, seasonality: true, unit: '%' },
    'Temperature': { base: 24, variance: 6, trend: 1, seasonality: true, unit: '°C' },
    'Humidity': { base: 72, variance: 10, trend: 0, seasonality: true, unit: '%' },
    'Leaf Wetness': { base: 45, variance: 15, trend: 0, seasonality: false, unit: '%' }
  };
  
  const config = configs[sensorType as keyof typeof configs] || configs['Soil Moisture'];
  
  return generateMockTimeSeries(
    startDate, 
    endDate, 
    config.base, 
    config.variance, 
    config.trend, 
    config.seasonality
  );
};
