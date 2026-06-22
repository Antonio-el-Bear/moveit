// Haversine formula to calculate distance between two coordinates
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Mock geocoding: convert address area to coordinates
// In production, use a real geocoding API like Google Maps, Nominatim, or Mapbox
export function addressToCoords(areaName) {
  const areaMap = {
    'johannesburg cbd': { lat: -26.205, lon: 28.047 },
    sandton: { lat: -26.109, lon: 28.055 },
    'pretoria north': { lat: -25.736, lon: 28.243 },
    'johannesburg': { lat: -26.205, lon: 28.047 },
    'default': { lat: -26.205, lon: 28.047 },
  };
  const key = (areaName || 'default').toLowerCase();
  return areaMap[key] || areaMap['default'];
}
