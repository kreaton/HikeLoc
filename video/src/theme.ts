// Colours from HikeLoc/wwwroot/css/app.css, so the mock screens look like the app.
export const c = {
  bg: "#f5f3ec",
  card: "#ffffff",
  ink: "#1c2a22",
  muted: "#5d6b63",
  green: "#14532d",
  amber: "#b45309",
  tabAmber: "#f59e0b",
  good: "#15803d",
  bad: "#b91c1c",
  line: "#d9d5c7",
  pinA: "#15803d",
  pinB: "#7c3aed",
  pinC: "#b45309",
};

export const font = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

// One example hike near Himmelbjerget, used by every scene so the numbers agree.
export const hike = {
  a: { lat: 56.10412, lon: 9.6853 },
  b: { lat: 56.1008, lon: 9.719 },
  c: { lat: 56.11893, lon: 9.6987 },
  me: { lat: 56.10734, lon: 9.69515 },
};

// Flat-earth metres from A, plenty for a few kilometres. North is up (negative y).
export const toXY = (p: { lat: number; lon: number }) => ({
  x: (p.lon - hike.a.lon) * 111320 * Math.cos((56.1 * Math.PI) / 180),
  y: -(p.lat - hike.a.lat) * 111320,
});
