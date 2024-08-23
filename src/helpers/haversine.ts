export const haversine = (
  userLat: number,
  userlng: number,
  placeLat: number,
  placelng: number,
) => {
  const R = 6371e3;
  const φ1 = (userLat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (placeLat * Math.PI) / 180;
  const Δφ = ((placeLat - userLat) * Math.PI) / 180;
  const Δλ = ((userlng - placelng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  const inRange = d < 1800; // 1.8km

  return inRange;
};
