import React from "react";
import { c, font } from "./theme";

// Top-down sketch of the method: a hill C, sight lines from A and B, and where they cross.
// Every prop is a 0..1 progress value so scenes can drive it with interpolate().
export const Diagram: React.FC<{
  lineA: number;
  walk: number;
  lineB: number;
  cross: number;
  angle?: number;
  width?: number;
}> = ({ lineA, walk, lineB, cross, angle = 0, width = 1000 }) => {
  const C = { x: 470, y: 170 };
  const A = { x: 230, y: 640 };
  const B = { x: 800, y: 600 };
  const hiker = { x: A.x + (B.x - A.x) * walk, y: A.y + (B.y - A.y) * walk - Math.sin(walk * Math.PI) * 30 };
  const along = (p: { x: number; y: number }, t: number) => ({ x: p.x + (C.x - p.x) * t, y: p.y + (C.y - p.y) * t });
  const ea = along(A, lineA);
  const eb = along(B, lineB);
  const dot = (p: { x: number; y: number }, color: string, text: string, s = 1) => (
    <g transform={`translate(${p.x} ${p.y}) scale(${s})`}>
      <circle r={26} fill={color} stroke="#fff" strokeWidth={5} />
      <text textAnchor="middle" dy={10} fontSize={28} fontWeight={800} fill="#fff" fontFamily={font}>
        {text}
      </text>
    </g>
  );
  // Angle arc at C between the two sight lines.
  const ang = (p: { x: number; y: number }) => Math.atan2(p.y - C.y, p.x - C.x);
  const r = 110;
  const a0 = ang(A);
  const a1 = a0 + (ang(B) - a0) * angle;
  const arc = `M ${C.x + r * Math.cos(a0)} ${C.y + r * Math.sin(a0)} A ${r} ${r} 0 0 0 ${C.x + r * Math.cos(a1)} ${C.y + r * Math.sin(a1)}`;
  return (
    <svg viewBox="0 0 1000 800" width={width} height={width * 0.8} style={{ overflow: "visible" }}>
      {/* contour rings of the hill */}
      {[150, 115, 82, 52, 26].map((rr, i) => (
        <ellipse key={rr} cx={C.x + i * 4} cy={C.y + i * 3} rx={rr * 1.25} ry={rr} fill={i === 4 ? "#c7d9c0" : "none"} stroke="#9fb89a" strokeWidth={2} />
      ))}
      <path d="M60 720 C 300 680, 600 740, 960 660" stroke="#d8cfb4" strokeWidth={14} fill="none" strokeLinecap="round" />
      <line x1={A.x} y1={A.y} x2={ea.x} y2={ea.y} stroke={c.pinA} strokeWidth={6} strokeDasharray="16 10" strokeLinecap="round" />
      <line x1={B.x} y1={B.y} x2={eb.x} y2={eb.y} stroke={c.pinB} strokeWidth={6} strokeDasharray="16 10" strokeLinecap="round" />
      {angle > 0 && (
        <>
          <path d={arc} stroke={c.tabAmber} strokeWidth={5} fill="none" />
          <text x={C.x} y={C.y + r + 55} textAnchor="middle" fontSize={28} fontWeight={700} fill={c.amber} fontFamily={font} opacity={angle}>
            45–90°
          </text>
        </>
      )}
      {lineA > 0 && dot(A, c.pinA, "A")}
      {walk > 0 && walk < 1 && (
        <g transform={`translate(${hiker.x} ${hiker.y})`}>
          <circle r={14} fill="#2563eb" stroke="#fff" strokeWidth={4} />
        </g>
      )}
      {walk >= 1 && dot(B, c.pinB, "B")}
      {cross > 0 && (
        <>
          <circle cx={C.x} cy={C.y} r={20 + 60 * cross} fill="none" stroke={c.tabAmber} strokeWidth={4} opacity={1 - cross} />
          {dot(C, c.pinC, "C", Math.min(1, cross * 2))}
        </>
      )}
      {cross <= 0 && (
        <text x={C.x} y={C.y + 10} textAnchor="middle" fontSize={34} fill="#5f7a5a" fontFamily={font}>
          ?
        </text>
      )}
    </svg>
  );
};
