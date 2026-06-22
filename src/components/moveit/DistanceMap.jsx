import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function DistanceMap({ driverLocation, pickupLocation, distance }) {
  if (!driverLocation || !pickupLocation) {
    return (
      <div className="w-full h-64 bg-muted rounded-3xl flex items-center justify-center border border-border">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const centerLat = (driverLocation.lat + pickupLocation.lat) / 2;
  const centerLon = (driverLocation.lon + pickupLocation.lon) / 2;

  return (
    <div className="w-full space-y-3">
      <div className="rounded-3xl overflow-hidden border border-border shadow-soft" style={{ height: '300px' }}>
        <MapContainer center={[centerLat, centerLon]} zoom={13} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[driverLocation.lat, driverLocation.lon]}>
            <Popup>Driver location</Popup>
          </Marker>
          <Marker position={[pickupLocation.lat, pickupLocation.lon]}>
            <Popup>Your location</Popup>
          </Marker>
        </MapContainer>
      </div>
      {distance !== null && (
        <div className="bg-card border border-border rounded-3xl p-4">
          <p className="text-sm text-muted-foreground">Distance to driver</p>
          <p className="text-2xl font-semibold text-foreground">{distance.toFixed(1)} km</p>
        </div>
      )}
    </div>
  );
}
