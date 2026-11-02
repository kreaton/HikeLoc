import React from "react";
import { c } from "./theme";

// Two 760 x 460 illustrations for the "hiking and sailing" scene. `line` 0..1 draws the sight line;
// `t` (the frame) rocks the boat and moves the waves.

const SightLine: React.FC<{ x1: number; y1: number; x2: number; y2: number; line: number }> = ({ x1, y1, x2, y2, line }) => {
  const x = x1 + (x2 - x1) * line;
  const y = y1 + (y2 - y1) * line;
  return (
    <>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={c.tabAmber} strokeWidth={5} strokeDasharray="14 9" strokeLinecap="round" />
      {line >= 1 && <circle cx={x2} cy={y2} r={22} fill="none" stroke={c.tabAmber} strokeWidth={5} />}
    </>
  );
};

export const Hiking: React.FC<{ line: number }> = ({ line }) => (
  <svg viewBox="0 0 760 460" width={760} height={460}>
    <defs>
      <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bfe0d0" />
        <stop offset="1" stopColor="#eef5e9" />
      </linearGradient>
    </defs>
    <rect width={760} height={460} fill="url(#hSky)" />
    <circle cx={640} cy={90} r={42} fill="#fff7e0" opacity={0.9} />
    {/* far ridge, peak, near hills */}
    <path d="M0 300 L120 210 L210 260 L300 190 L400 270 L520 200 L640 260 L760 220 L760 460 L0 460 Z" fill="#8fbf9e" />
    <path d="M300 330 L470 110 L640 330 Z" fill="#d7e4da" />
    <path d="M470 110 L640 330 L470 330 Z" fill="#a9bfb0" />
    <path d="M470 110 L432 160 L452 152 L470 168 L490 150 L508 160 Z" fill="#fff" />
    <path d="M0 360 C 160 300, 300 340, 420 330 S 650 300, 760 330 L 760 460 L 0 460 Z" fill="#2f8a55" />
    <path d="M0 410 C 200 380, 420 420, 760 390 L 760 460 L 0 460 Z" fill="#14532d" />
    {/* trees */}
    {[60, 95, 650, 700].map((x, i) => (
      <path key={i} d={`M${x} ${392 - (i % 2) * 10} l18 -54 l18 54 Z`} fill="#0f3d22" />
    ))}
    {/* hiker holding a phone flat, facing the peak */}
    <g transform="translate(170 300)">
      <rect x={-22} y={-58} width={22} height={40} rx={7} fill="#b45309" />
      <rect x={-8} y={-62} width={22} height={52} rx={9} fill="#1d4ed8" />
      <circle cx={4} cy={-78} r={14} fill="#f1c7a3" />
      <path d="M-10 -86 Q4 -100 18 -86 Z" fill="#7c2d12" />
      <line x1={0} y1={-10} x2={-6} y2={40} stroke="#374151" strokeWidth={9} strokeLinecap="round" />
      <line x1={8} y1={-10} x2={14} y2={40} stroke="#374151" strokeWidth={9} strokeLinecap="round" />
      <line x1={10} y1={-48} x2={34} y2={-40} stroke="#1d4ed8" strokeWidth={8} strokeLinecap="round" />
      <rect x={32} y={-46} width={18} height={6} rx={2} fill="#111" />
      <line x1={-24} y1={-30} x2={-34} y2={40} stroke="#6b4f2a" strokeWidth={4} />
    </g>
    <SightLine x1={212} y1={254} x2={470} y2={118} line={line} />
    <text x={470} y={70} textAnchor="middle" fontSize={26} fontWeight={700} fill={c.green} opacity={line >= 1 ? 1 : 0}>
      Summit
    </text>
  </svg>
);

export const Sailing: React.FC<{ t: number; line: number }> = ({ t, line }) => {
  const bob = Math.sin(t / 12) * 4;
  const tilt = Math.sin(t / 15) * 2;
  const wave = (y: number, phase: number, color: string) => {
    const d = Array.from({ length: 21 }, (_, i) => {
      const x = i * 40;
      return `${i === 0 ? "M" : "L"}${x} ${y + Math.sin(i * 0.9 + t / 10 + phase) * 5}`;
    }).join(" ");
    return <path d={`${d} L760 460 L0 460 Z`} fill={color} />;
  };
  return (
    <svg viewBox="0 0 760 460" width={760} height={460}>
      <defs>
        <linearGradient id="sSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcdcf0" />
          <stop offset="1" stopColor="#eef6fb" />
        </linearGradient>
      </defs>
      <rect width={760} height={460} fill="url(#sSky)" />
      <circle cx={110} cy={85} r={40} fill="#fff7e0" opacity={0.9} />
      {/* headland with a lighthouse */}
      <path d="M420 250 C 480 200, 560 190, 640 205 S 760 215, 760 220 L 760 260 L 420 260 Z" fill="#7aa37f" />
      <path d="M600 205 L604 140 L622 140 L626 205 Z" fill="#fff" />
      <rect x={603} y={155} width={20} height={12} fill={c.bad} />
      <rect x={601} y={180} width={24} height={12} fill={c.bad} />
      <rect x={604} y={124} width={18} height={16} fill="#334155" />
      <path d="M600 124 L613 110 L626 124 Z" fill={c.bad} />
      <circle cx={613} cy={132} r={5} fill="#fde68a" />
      {wave(250, 0, "#5b9bc8")}
      {wave(300, 1.7, "#3f7fb0")}
      {/* sailboat */}
      <g transform={`translate(200 ${330 + bob}) rotate(${tilt})`}>
        <path d="M-90 0 L90 0 L65 34 L-70 34 Z" fill="#f8fafc" stroke="#1e293b" strokeWidth={3} />
        <rect x={-90} y={8} width={175} height={6} fill={c.green} />
        <line x1={0} y1={0} x2={0} y2={-190} stroke="#1e293b" strokeWidth={5} />
        <path d="M4 -184 L4 -10 L84 -10 Z" fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
        <path d="M-4 -170 L-4 -14 L-74 -14 Z" fill="#fef3c7" stroke="#e7d9a8" strokeWidth={2} />
        <circle cx={40} cy={-6} r={9} fill="#f1c7a3" />
      </g>
      {wave(380, 3.1, "#2c6a9a")}
      <SightLine x1={250} y1={322 + bob} x2={613} y2={132} line={line} />
      <text x={613} y={86} textAnchor="middle" fontSize={26} fontWeight={700} fill="#1e3a5f" opacity={line >= 1 ? 1 : 0}>
        Lighthouse
      </text>
    </svg>
  );
};
