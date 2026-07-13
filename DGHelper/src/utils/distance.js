export function calculateDistance(coord1, coord2) {
  const R = 6371000; // Earth's radius in meters

  const toRad = (deg) => (deg * Math.PI) / 180;

  const lat1 = toRad(coord1.latitude ?? coord1.lat);
  const lat2 = toRad(coord2.latitude ?? coord2.lat);
  const lng1 = toRad(coord1.longitude ?? coord1.lng);
  const lng2 = toRad(coord2.longitude ?? coord2.lng);

  const deltaLat = lat2 - lat1;
  const deltaLng = lng2 - lng1;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function calculateBearing(from, to) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const lat1 = toRad(from.lat ?? from.latitude);
  const lat2 = toRad(to.lat ?? to.latitude);
  const dLng = toRad((to.lng ?? to.longitude) - (from.lng ?? from.longitude));
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}