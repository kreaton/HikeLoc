import React from "react";
import { c, hike, toXY } from "./theme";

// Mock-ups of the four tabs, styled after app.css and filled with the example hike.

const card: React.CSSProperties = {
  background: c.card,
  border: `1px solid ${c.line}`,
  borderRadius: 14,
  padding: 14,
  marginBottom: 12,
};
const h2: React.CSSProperties = { margin: "0 0 8px", fontSize: 17.6, fontWeight: 700 };
const hint: React.CSSProperties = { color: c.muted, margin: "6px 0", fontSize: 14.7 };
const lbl: React.CSSProperties = { display: "block", fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em", color: c.muted };
const label: React.CSSProperties = { display: "block", margin: "0 0 8px", fontSize: 14.7, color: c.muted };

export const Highlight: React.FC<{ on: boolean; children: React.ReactNode }> = ({ on, children }) => (
  <div
    style={{
      borderRadius: 14,
      boxShadow: on ? `0 0 0 4px ${c.tabAmber}` : "0 0 0 0 transparent",
      transition: "none",
    }}
  >
    {children}
  </div>
);

const BigButton: React.FC<{ children: React.ReactNode; disabled?: boolean; on?: boolean; pressed?: boolean }> = ({
  children,
  disabled,
  on,
  pressed,
}) => (
  <div
    style={{
      width: "100%",
      padding: "16px 12px",
      fontSize: 17.6,
      fontWeight: 700,
      borderRadius: 12,
      textAlign: "center",
      background: disabled ? "#a8b5ad" : on ? c.amber : c.green,
      color: "#fff",
      transform: pressed ? "scale(.97)" : undefined,
    }}
  >
    {children}
  </div>
);

const Input: React.FC<{ value?: string; placeholder?: string; focus?: boolean }> = ({ value, placeholder, focus }) => (
  <div
    style={{
      marginTop: 4,
      padding: 12,
      fontSize: 16,
      border: `1px solid ${focus ? c.green : c.line}`,
      boxShadow: focus ? `0 0 0 2px ${c.green}` : undefined,
      borderRadius: 10,
      background: "#fff",
      color: value ? c.ink : "#9aa39d",
      minHeight: 46,
    }}
  >
    {value || placeholder}
  </div>
);

export type SightState = {
  running: boolean;
  gps?: number;
  heading?: number;
  aDone?: boolean;
  bDone?: boolean;
  busy?: boolean;
  message?: string;
  showC?: boolean;
  pressed?: "start" | "A" | "B";
  scroll?: number;
  highlight?: "start" | "A" | "B" | "C";
};

const sub: React.CSSProperties = { fontSize: 14, color: c.muted, margin: "6px 0 0" };

export const SightScreen: React.FC<SightState> = (s) => (
  <div style={{ transform: `translateY(${-(s.scroll ?? 0)}px)` }}>
    <Highlight on={s.highlight === "start"}>
      <div style={card}>
        {!s.running ? (
          <>
            <div style={h2}>HikeLoc</div>
            <p style={hint}>
              Sight a landscape feature <b>C</b> from two places, <b>A</b> and <b>B</b>, and HikeLoc works out where C is.
            </p>
            <BigButton pressed={s.pressed === "start"}>Start GPS &amp; compass</BigButton>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0" }}>
              <div>
                <span style={lbl}>GPS</span>
                <b style={{ fontSize: 20, color: (s.gps ?? 5) <= 15 ? c.good : (s.gps ?? 5) <= 40 ? c.amber : c.bad }}>±{s.gps ?? 5} m</b>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={lbl}>Heading (true)</span>
                <b style={{ fontSize: 20 }}>{Math.round(((s.heading ?? 0) + 360) % 360)}°</b>
              </div>
            </div>
            <div style={{ color: c.green, textDecoration: "underline", padding: "6px 0", fontSize: 15 }}>
              Stop sensors (saves battery)
            </div>
          </>
        )}
      </div>
    </Highlight>

    <div style={card}>
      <div style={h2}>Sightings</div>
      <p style={hint}>Hold the phone flat like a compass, top edge pointing at C, hold steady and tap.</p>
      <div style={{ margin: "12px 0 16px" }}>
        <span style={label}>
          Compass bearing to C from A (optional)
          <Input placeholder="use phone compass" />
        </span>
        <Highlight on={s.highlight === "A"}>
          <BigButton disabled={!s.running} pressed={s.pressed === "A"}>
            {s.aDone ? "Re-record A" : "Record A"}
          </BigButton>
        </Highlight>
      </div>
      <div style={{ margin: "12px 0 10px" }}>
        <span style={label}>
          Compass bearing to C from B (optional)
          <Input placeholder="use phone compass" />
        </span>
        <Highlight on={s.highlight === "B"}>
          <BigButton disabled={!s.running || !s.aDone} pressed={s.pressed === "B"}>
            {s.bDone ? "Re-record B" : "Record B"}
          </BigButton>
        </Highlight>
      </div>
      {s.busy && <p style={hint}>Hold steady…</p>}
      {s.message && <p style={{ color: c.good, margin: "8px 0" }}>{s.message}</p>}
      {s.aDone && (
        <p style={sub}>
          <b>A</b> 56.10412, 9.68530 (±5 m) · bearing 22° magnetic, 27° true · compass spread ±3°
        </p>
      )}
      {s.bDone && (
        <p style={sub}>
          <b>B</b> 56.10080, 9.71900 (±4 m) · bearing 324° magnetic, 328° true · compass spread ±4°
        </p>
      )}
    </div>

    {s.showC && (
      <Highlight on={s.highlight === "C"}>
        <div style={card}>
          <div style={h2}>Feature C</div>
          {[
            ["From A", "1.85 km", " at 27°"],
            ["From B", "2.38 km", " at 328°"],
            ["Position", "", "56.11893, 9.69870"],
            ["Uncertainty", "", "about ±140 m (sight lines cross at 59°)"],
          ].map(([k, big, rest]) => (
            <div key={k} style={{ margin: "6px 0" }}>
              <span style={lbl}>{k}</span>
              {big && <b style={{ fontSize: 18.4 }}>{big}</b>}
              {rest}
            </div>
          ))}
        </div>
      </Highlight>
    )}
  </div>
);

export const SettingsScreen: React.FC<{ declination: string; focus: boolean }> = ({ declination, focus }) => (
  <div>
    <div style={card}>
      <div style={h2}>Compass</div>
      <span style={{ ...label, margin: "10px 0" }}>
        Magnetic declination (° east is positive)
        <Highlight on={focus}>
          <Input value={declination} />
        </Highlight>
      </span>
      <p style={hint}>Applied to both the phone compass and typed bearings. Look up your area at NOAA.</p>
      <span style={{ ...label, margin: "10px 0" }}>
        Assumed compass error (± °)
        <Input value="5" />
      </span>
      <p style={hint}>Only used for the uncertainty estimate on C.</p>
    </div>
    <div style={card}>
      <div style={h2}>Map</div>
      <span style={{ ...label, margin: "10px 0" }}>
        Thunderforest API key (for the cycle map)
        <Input />
      </span>
      <p style={hint}>Free key from thunderforest.com. Stored only on this device.</p>
    </div>
    <div style={card}>
      <div style={h2}>Data</div>
      <p style={hint}>Settings and sightings are saved in this browser's local storage.</p>
      <div style={{ color: c.bad, textDecoration: "underline", padding: "6px 0" }}>Clear sightings</div>
    </div>
  </div>
);

// A drawn stand-in for the Leaflet map: lake, woods, paths, and the A/B/C pins.
export const MapScreen: React.FC<{ lines: number; pins: number; layer: "Street" | "Cycle" }> = ({ lines, pins, layer }) => {
  const k = 0.11; // px per metre
  const ox = 90;
  const oy = 560;
  const pt = (p: { lat: number; lon: number }) => {
    const v = toXY(p);
    return { x: ox + v.x * k, y: oy + v.y * k };
  };
  const a = pt(hike.a);
  const b = pt(hike.b);
  const cc = pt(hike.c);
  const me = pt(hike.me);
  const lineTo = (from: { x: number; y: number }, t: number) => ({
    x: from.x + (cc.x - from.x) * t,
    y: from.y + (cc.y - from.y) * t,
  });
  const la = lineTo(a, Math.min(1, lines * 2));
  const lb = lineTo(b, Math.max(0, Math.min(1, lines * 2 - 1)));
  const Pin: React.FC<{ p: { x: number; y: number }; color: string; text: string; s: number }> = ({ p, color, text, s }) => (
    <div
      style={{
        position: "absolute",
        left: p.x - 17,
        top: p.y - 17,
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        fontWeight: 800,
        display: "grid",
        placeItems: "center",
        border: "3px solid #fff",
        boxShadow: "0 1px 4px rgba(0,0,0,.5)",
        transform: `scale(${s})`,
      }}
    >
      {text}
    </div>
  );
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return (
    <div style={{ position: "absolute", inset: 0, background: layer === "Street" ? "#eef0e6" : "#e8eedb", overflow: "hidden" }}>
      <svg width={390} height={720} style={{ position: "absolute", inset: 0 }}>
        <path d="M-20 120 C 80 90, 140 160, 230 130 S 380 60, 420 100 L 420 -10 L -20 -10 Z" fill="#cfe3c4" />
        <path d="M250 300 C 300 260, 400 280, 410 340 L 410 460 C 360 470, 300 430, 260 400 Z" fill="#a9d1e8" />
        <path d="M-10 420 C 60 400, 90 470, 40 520 S -10 600, -10 600 Z" fill="#cfe3c4" />
        <path d="M-10 640 C 100 600, 200 660, 410 610" stroke="#fff" strokeWidth={9} fill="none" />
        <path d="M-10 640 C 100 600, 200 660, 410 610" stroke="#f3c969" strokeWidth={5} fill="none" />
        <path d="M60 760 C 90 600, 150 470, 200 360 S 260 160, 240 -20" stroke="#fff" strokeWidth={5} fill="none" strokeDasharray={layer === "Cycle" ? "10 6" : undefined} />
        <path d="M200 360 C 240 340, 300 330, 330 250" stroke="#c96" strokeWidth={2.5} strokeDasharray="5 5" fill="none" />
        {[[80, 200], [140, 230], [330, 170], [60, 300], [300, 540]].map(([x, y], i) => (
          <text key={i} x={x} y={y} fontSize={12} fill="#7a8b6f">
            ▲
          </text>
        ))}
        <text x={278} y={372} fontSize={12} fill="#4c7d99" fontStyle="italic">
          Julsø
        </text>
        <line x1={a.x} y1={a.y} x2={la.x} y2={la.y} stroke={c.pinA} strokeWidth={3} strokeDasharray="8 6" />
        <line x1={b.x} y1={b.y} x2={lb.x} y2={lb.y} stroke={c.pinB} strokeWidth={3} strokeDasharray="8 6" />
        <circle cx={cc.x} cy={cc.y} r={140 * k * clamp(pins * 3 - 2)} fill="rgba(180,83,9,.15)" stroke={c.pinC} strokeWidth={1.5} />
        <circle cx={me.x} cy={me.y} r={9} fill="#2563eb" stroke="#fff" strokeWidth={3} opacity={clamp(pins * 3 - 2)} />
      </svg>
      <Pin p={a} color={c.pinA} text="A" s={clamp(pins * 3)} />
      <Pin p={b} color={c.pinB} text="B" s={clamp(pins * 3 - 1)} />
      <Pin p={cc} color={c.pinC} text="C" s={clamp(pins * 3 - 2)} />
      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        {["Street", "Cycle", "Fit"].map((t) => (
          <div
            key={t}
            style={{
              background: t === layer ? c.green : "#fff",
              color: t === layer ? "#fff" : c.ink,
              border: `1px solid ${t === layer ? c.green : c.line}`,
              borderRadius: 8,
              padding: "10px 14px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {t}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 4, bottom: 2, fontSize: 10, color: "#666", background: "rgba(255,255,255,.7)", padding: "0 4px" }}>
        © OpenStreetMap contributors
      </div>
    </div>
  );
};

// Navigate tab. relative = bearing to target minus heading; 0 means straight ahead.
export const NavScreen: React.FC<{
  target?: "A" | "B" | "C";
  relative: number;
  distance: string;
  bearing: number;
  heading: number;
  pressed?: boolean;
}> = ({ target, relative, distance, bearing, heading, pressed }) => {
  const aligned = Math.abs(relative) < 10;
  return (
    <div>
      <div style={card}>
        <div style={h2}>Navigate to</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {(["A", "B", "C"] as const).map((t) => (
            <BigButton key={t} on={target === t} pressed={pressed && t === "C"}>
              {t}
            </BigButton>
          ))}
        </div>
      </div>
      {target ? (
        <div style={{ ...card, textAlign: "center" }}>
          <svg viewBox="-100 -100 200 200" width={260} height={260} style={{ margin: "6px auto", display: "block" }}>
            <circle r={92} fill={aligned ? "#dcfce7" : "#f1efe6"} stroke={aligned ? c.good : c.line} strokeWidth={3} />
            <polygon
              points="0,-80 34,30 0,12 -34,30"
              fill={aligned ? c.good : c.amber}
              stroke={aligned ? "#14532d" : "#7c3a06"}
              strokeWidth={2}
              strokeLinejoin="round"
              transform={`rotate(${relative})`}
            />
          </svg>
          <p style={hint}>Arrow up = straight ahead. Hold the phone flat, top edge forward.</p>
          <div style={{ fontSize: 48, fontWeight: 800, margin: "4px 0 10px" }}>{distance}</div>
          <div style={{ display: "flex", justifyContent: "space-between", textAlign: "left" }}>
            <div>
              <span style={lbl}>Bearing to {target}</span>
              <b style={{ fontSize: 20 }}>{bearing}°</b>
            </div>
            <div>
              <span style={lbl}>Your heading</span>
              <b style={{ fontSize: 20 }}>{Math.round((heading + 360) % 360)}°</b>
            </div>
            <div>
              <span style={lbl}>GPS</span>
              <b style={{ fontSize: 20 }}>±4 m</b>
            </div>
          </div>
        </div>
      ) : (
        <div style={card}>
          <p style={hint}>Pick A, B or C to get a live distance and direction.</p>
        </div>
      )}
    </div>
  );
};
