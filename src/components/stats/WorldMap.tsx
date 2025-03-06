
import React from 'react';
import { Card } from "@/components/ui/card";
import { UserStats } from '@/types/stats';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default leaflet icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WorldMapProps {
  allStats: UserStats[];
}

export const WorldMap = ({ allStats }: WorldMapProps) => {
  // Function to extract countries from stats
  const extractCountryData = (stats: UserStats[]) => {
    const countries: Record<string, { count: number, coordinates: [number, number] }> = {};
    
    // Count occurrences of each country
    stats.forEach(stat => {
      if (!stat.location) return;
      
      const country = stat.location.split(', ').pop() || 'Unknown';
      
      // Only add countries we have coordinates for
      if (demoCoordinates[country]) {
        if (!countries[country]) {
          countries[country] = { 
            count: 0, 
            coordinates: demoCoordinates[country] 
          };
        }
        countries[country].count += 1;
      }
    });
    
    return countries;
  };
  
  // Sample coordinates for demo
  const demoCoordinates: Record<string, [number, number]> = {
    'Romania': [45.9432, 24.9668],
    'USA': [37.0902, -95.7129],
    'UK': [55.3781, -3.4360],
    'Germany': [51.1657, 10.4515],
    'France': [46.2276, 2.2137],
    'Spain': [40.4637, -3.7492],
    'Australia': [-25.2744, 133.7751],
    'Japan': [36.2048, 138.2529],
    'China': [35.8617, 104.1954],
    'Canada': [56.1304, -106.3468],
  };

  const countryData = extractCountryData(allStats);
  const markerColor = '#62B8F6';

  // Custom icon for markers with count
  const createCountIcon = (count: number) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${markerColor}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; font-weight: bold;">${count}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  return (
    <Card className="p-6 bg-gray-900 text-white shadow-sm col-span-1 md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Top Countries</h2>
      
      <div className="h-[400px] w-full rounded-md overflow-hidden relative">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          {Object.entries(countryData).map(([country, data]) => (
            <Marker 
              key={country}
              position={data.coordinates}
              icon={createCountIcon(data.count)}
            >
              <Popup>
                <div className="text-xs font-medium text-gray-900">
                  <div>{country}</div>
                  <div>{data.count} {data.count === 1 ? 'visit' : 'visits'}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};
