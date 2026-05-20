/**
 * Calculate distance between two GPS coordinates (in meters)
 * Uses Haversine formula for accuracy
 */
export function calculateDistance(coord1, coord2) {
  const R = 6371000; // Earth's radius in meters
  
  const toRad = (deg) => (deg * Math.PI) / 180;
  
  const lat1 = toRad(coord1.latitude || coord1.lat);
  const lat2 = toRad(coord2.latitude || coord2.lat);
  const deltaLat = toRad((coord2.latitude || coord2.lat) - lat1);
  const deltaLng = toRad((coord2.longitude || coord2.lng) - (coord1.longitude || coord1.lng));

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
}

/**
 * Format distance for display
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}