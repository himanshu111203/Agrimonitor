import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SpectralHeatmapProps {
  title: string;
  farmBounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  status: string;
  description: string;
  colorScale: string;
}

const SpectralHeatmap: React.FC<SpectralHeatmapProps> = ({
  title,
  farmBounds,
  status,
  description,
  colorScale
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [tokenError, setTokenError] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = token;
      
      // Calculate center of farm bounds
      const centerLat = (farmBounds.minLat + farmBounds.maxLat) / 2;
      const centerLng = (farmBounds.minLng + farmBounds.maxLng) / 2;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [centerLng, centerLat],
        zoom: 14,
        minZoom: 10,
        maxZoom: 18
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      map.current.on('load', () => {
        if (!map.current) return;

        // Add farm boundary
        map.current.addSource('farm-boundary', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              'coordinates': [[
                [farmBounds.minLng, farmBounds.minLat],
                [farmBounds.maxLng, farmBounds.minLat],
                [farmBounds.maxLng, farmBounds.maxLat],
                [farmBounds.minLng, farmBounds.maxLat],
                [farmBounds.minLng, farmBounds.minLat]
              ]]
            },
            'properties': {}
          }
        });

        // Add boundary outline
        map.current.addLayer({
          'id': 'farm-boundary-line',
          'type': 'line',
          'source': 'farm-boundary',
          'layout': {},
          'paint': {
            'line-color': '#ffffff',
            'line-width': 3,
            'line-opacity': 0.8
          }
        });

        // Generate mock heatmap data points within farm bounds
        const heatmapData = generateHeatmapData(farmBounds, title);
        
        map.current.addSource('heatmap-data', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': heatmapData
          }
        });

        // Add heatmap layer
        map.current.addLayer({
          'id': 'heatmap-layer',
          'type': 'heatmap',
          'source': 'heatmap-data',
          'maxzoom': 15,
          'paint': {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, 0,
              1, 1
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              15, 3
            ],
            'heatmap-color': getHeatmapColors(colorScale),
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 20,
              15, 40
            ],
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              15, 0.8
            ]
          }
        });

        // Add circle layer for higher zoom levels
        map.current.addLayer({
          'id': 'heatmap-points',
          'type': 'circle',
          'source': 'heatmap-data',
          'minzoom': 14,
          'paint': {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, 4,
              1, 12
            ],
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, '#313695',
              0.2, '#4575b4',
              0.4, '#74add1',
              0.6, '#abd9e9',
              0.8, '#fee090',
              1, '#d73027'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.8
          }
        });

        // Add popup on click
        map.current.on('click', 'heatmap-points', (e) => {
          if (!e.features || !e.features[0] || !map.current) return;
          
          const feature = e.features[0];
          const coordinates = (feature.geometry as any).coordinates.slice();
          const intensity = feature.properties?.intensity || 0;
          
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div style="padding: 8px;">
                <strong>${title}</strong><br/>
                <span>Value: ${intensity.toFixed(3)}</span><br/>
                <span>Location: ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}</span>
              </div>
            `)
            .addTo(map.current);
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'heatmap-points', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'heatmap-points', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      });

      setShowTokenInput(false);
      setTokenError("");
    } catch (error) {
      setTokenError("Invalid Mapbox token. Please check your token and try again.");
    }
  };

  const generateHeatmapData = (bounds: any, indexType: string) => {
    const features = [];
    const gridSize = 20; // 20x20 grid
    
    const latStep = (bounds.maxLat - bounds.minLat) / gridSize;
    const lngStep = (bounds.maxLng - bounds.minLng) / gridSize;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = bounds.minLat + i * latStep + Math.random() * latStep;
        const lng = bounds.minLng + j * lngStep + Math.random() * lngStep;
        
        // Generate different patterns for different indices
        let intensity;
        switch (indexType) {
          case 'NDVI':
            intensity = 0.3 + 0.4 * Math.sin(i * 0.3) * Math.cos(j * 0.3) + 0.1 * Math.random();
            break;
          case 'NDWI':
            intensity = 0.2 + 0.3 * Math.cos(i * 0.2) + 0.1 * Math.random();
            break;
          case 'SAVI':
            intensity = 0.4 + 0.3 * Math.sin(j * 0.4) + 0.1 * Math.random();
            break;
          case 'WBI':
            intensity = 0.5 + 0.4 * Math.sin((i + j) * 0.2) + 0.1 * Math.random();
            break;
          default:
            intensity = 0.3 + 0.4 * Math.random();
        }
        
        intensity = Math.max(0, Math.min(1, intensity));
        
        features.push({
          'type': 'Feature',
          'properties': {
            'intensity': intensity
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [lng, lat]
          }
        });
      }
    }
    
    return features;
  };

  const getHeatmapColors = (colorScale: string) => {
    const scales: { [key: string]: any } = {
      'ndvi': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(255, 255, 255, 0)',
        0.2, '#fee8c8',
        0.4, '#fdbb84',
        0.6, '#e34a33',
        0.8, '#b30000',
        1, '#7f0000'
      ],
      'water': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(255, 255, 255, 0)',
        0.2, '#deebf7',
        0.4, '#9ecae1',
        0.6, '#4292c6',
        0.8, '#2171b5',
        1, '#084594'
      ],
      'default': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(33, 102, 172, 0)',
        0.2, 'rgb(103, 169, 207)',
        0.4, 'rgb(209, 229, 240)',
        0.6, 'rgb(253, 219, 199)',
        0.8, 'rgb(239, 138, 98)',
        1, 'rgb(178, 24, 43)'
      ]
    };
    
    return scales[colorScale] || scales.default;
  };

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      setTokenError("Please enter a Mapbox token");
      return;
    }
    initializeMap(mapboxToken);
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

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <Card className="shadow-farm-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title} Heatmap</CardTitle>
          <Badge variant={getStatusColor(status)}>{status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {showTokenInput ? (
          <div className="space-y-4 p-6 text-center bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              To display the heatmap, please enter your Mapbox public token.
              <br />
              Get your token from{" "}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="max-w-md mx-auto space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className={tokenError ? "border-destructive" : ""}
              />
              {tokenError && (
                <p className="text-sm text-destructive">{tokenError}</p>
              )}
              <Button onClick={handleTokenSubmit} className="w-full">
                Load Heatmap
              </Button>
            </div>
          </div>
        ) : (
          <div 
            ref={mapContainer} 
            className="h-80 w-full rounded-lg border border-border overflow-hidden"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SpectralHeatmap;
