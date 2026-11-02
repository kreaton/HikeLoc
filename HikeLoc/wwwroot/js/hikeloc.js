// HikeLoc browser interop: geolocation, compass and Leaflet map.
// Loaded as an ES module from .NET via IJSRuntime ("import").

const SAMPLE_KEEP_MS = 5000;

let dotnet = null;
let watchId = null;
let timer = null;
let wakeLock = null;
let lastPos = null;
let lastError = null;
let samples = []; // { t, h } compass headings in degrees, magnetic
let orientationListeners = [];

const norm = (d) => ((d % 360) + 360) % 360;
const rad = (d) => (d * Math.PI) / 180;
const deg = (r) => (r * 180) / Math.PI;

function circularStats(list) {
  if (list.length === 0) return null;
  let s = 0, c = 0;
  for (const { h } of list) { s += Math.sin(rad(h)); c += Math.cos(rad(h)); }
  const n = list.length;
  const r = Math.min(1, Math.hypot(s, c) / n);
  const mean = norm(deg(Math.atan2(s / n, c / n)));
  const std = r > 0 ? deg(Math.sqrt(-2 * Math.log(r))) : 180;
  return { mean, stdDev: Number.isFinite(std) ? std : 0, count: n };
}

/**
 * Direction the phone is pointing, from W3C alpha/beta/gamma (Z-X'-Y'' rotation).
 * Uses the top edge when the phone is roughly flat and the back of the phone when it is held upright,
 * so the answer stays sensible either way. Result is degrees clockwise from the reference north.
 */
function pointingHeading(alpha, beta, gamma) {
  const a = rad(alpha), b = rad(beta), g = rad(gamma);
  const cA = Math.cos(a), sA = Math.sin(a), cB = Math.cos(b), sB = Math.sin(b), cG = Math.cos(g), sG = Math.sin(g);
  // Top edge (device +y) in earth frame (east, north)
  const topE = -cB * sA, topN = cA * cB;
  // Back of phone (device -z) in earth frame (east, north)
  const backE = -(cA * sG + cG * sA * sB), backN = -(sA * sG - cA * cG * sB);
  const useTop = Math.hypot(topE, topN) >= Math.hypot(backE, backN);
  const e = useTop ? topE : backE, n = useTop ? topN : backN;
  return norm(deg(Math.atan2(e, n)));
}

function pushHeading(h) {
  const t = performance.now();
  samples.push({ t, h });
  while (samples.length && t - samples[0].t > SAMPLE_KEEP_MS) samples.shift();
}

function onOrientation(e) {
  if (typeof e.webkitCompassHeading === 'number') {
    pushHeading(norm(e.webkitCompassHeading)); // iOS: magnetic heading, clockwise
    return;
  }
  if (e.alpha == null) return;
  // Android: only trust events that are referenced to magnetic north.
  if (e.type === 'deviceorientationabsolute' || e.absolute === true) {
    pushHeading(pointingHeading(e.alpha, e.beta ?? 0, e.gamma ?? 0));
  }
}

function currentHeading() {
  const now = performance.now();
  return circularStats(samples.filter((s) => now - s.t < 400))?.mean ?? null;
}

export async function start(ref) {
  dotnet = ref;
  lastError = null;

  // iOS requires an explicit permission request from a user gesture. Do it first.
  try {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      const r = await DeviceOrientationEvent.requestPermission();
      if (r !== 'granted') lastError = 'Compass permission was denied. Enable motion & orientation access for this site.';
    }
  } catch (e) {
    lastError = 'Compass: ' + (e && e.message ? e.message : e);
  }

  stop(false);

  const add = (type) => {
    window.addEventListener(type, onOrientation, true);
    orientationListeners.push(type);
  };
  if ('ondeviceorientationabsolute' in window) add('deviceorientationabsolute');
  add('deviceorientation');

  if ('geolocation' in navigator) {
    watchId = navigator.geolocation.watchPosition(
      (p) => { lastPos = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy }; lastError = null; },
      (e) => { lastError = 'GPS: ' + e.message; },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );
  } else {
    lastError = 'Geolocation is not available in this browser.';
  }

  try { wakeLock = await navigator.wakeLock?.request('screen'); } catch { /* optional */ }

  timer = setInterval(() => {
    dotnet.invokeMethodAsync('OnReading', currentHeading(), lastPos?.lat ?? null, lastPos?.lon ?? null, lastPos?.acc ?? null, lastError);
  }, 200);

  // Give the compass a moment so a missing sensor can be reported on first call.
  await new Promise((r) => setTimeout(r, 600));
  if (samples.length === 0 && !lastError) lastError = 'No compass data yet. Move the phone in a figure-eight to calibrate, or this device has no magnetometer.';
  return lastError;
}

export function stop(clearAll = true) {
  if (timer) { clearInterval(timer); timer = null; }
  if (watchId != null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
  for (const t of orientationListeners) window.removeEventListener(t, onOrientation, true);
  orientationListeners = [];
  if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
  if (clearAll) { samples = []; lastPos = null; }
}

/** Circular mean/spread of compass headings over the last windowMs. Returns null if there are none. */
export function sampleHeading(windowMs) {
  const now = performance.now();
  const s = circularStats(samples.filter((x) => now - x.t <= windowMs));
  return s ? { mean: s.mean, stdDev: s.stdDev, count: s.count } : null;
}

// ---------------------------------------------------------------- map

let map = null;
let tile = null;
let layerGroup = null;

function makeTile(layer, key) {
  if (layer === 'cycle' && key) {
    return L.tileLayer(`https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=${encodeURIComponent(key)}`, {
      maxZoom: 19,
      attribution: 'Maps &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
  }
  return L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
}

export function initMap(elementId, layer, key) {
  destroyMap();
  map = L.map(elementId, { zoomControl: false }).setView([56.0, 10.5], 7);
  layerGroup = L.layerGroup().addTo(map);
  setLayer(layer, key);
}

export function setLayer(layer, key) {
  if (!map) return;
  if (tile) map.removeLayer(tile);
  tile = makeTile(layer, key);
  tile.addTo(map);
  tile.bringToBack();
}

export function destroyMap() {
  if (map) { map.remove(); map = null; tile = null; layerGroup = null; }
}

const pin = (label, cls) =>
  L.divIcon({ className: '', html: `<div class="pin ${cls}">${label}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] });

export function updateMap(pts, fit) {
  if (!map) return;
  layerGroup.clearLayers();
  const ll = (p) => [p.lat, p.lon];
  const bounds = [];

  if (pts.a && pts.c) L.polyline([ll(pts.a), ll(pts.c)], { color: '#b45309', weight: 3, opacity: 0.8 }).addTo(layerGroup);
  if (pts.b && pts.c) L.polyline([ll(pts.b), ll(pts.c)], { color: '#b45309', weight: 3, opacity: 0.8, dashArray: '6 8' }).addTo(layerGroup);
  if (pts.a && pts.b) L.polyline([ll(pts.a), ll(pts.b)], { color: '#475569', weight: 2, opacity: 0.6 }).addTo(layerGroup);

  for (const [name, p, cls] of [['A', pts.a, 'a'], ['B', pts.b, 'b'], ['C', pts.c, 'c']]) {
    if (!p) continue;
    L.marker(ll(p), { icon: pin(name, cls), keyboard: false }).addTo(layerGroup);
    bounds.push(ll(p));
  }
  if (pts.me) {
    L.circleMarker(ll(pts.me), { radius: 8, color: '#fff', weight: 3, fillColor: '#2563eb', fillOpacity: 1 }).addTo(layerGroup);
    bounds.push(ll(pts.me));
  }

  if (fit && bounds.length) {
    if (bounds.length === 1) map.setView(bounds[0], 16);
    else map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
  }
}
