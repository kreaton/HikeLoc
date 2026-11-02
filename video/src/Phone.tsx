import React from "react";
import { c, font } from "./theme";

export type TabName = "Sight" | "Map" | "Navigate" | "Settings";

// A phone frame with the app's bottom tab bar. Screen content is 390 x 780 CSS px.
export const Phone: React.FC<{ tab: TabName; children: React.ReactNode; padded?: boolean }> = ({
  tab,
  children,
  padded = true,
}) => (
  <div
    style={{
      width: 430,
      height: 880,
      borderRadius: 64,
      background: "#111",
      padding: 20,
      boxShadow: "0 40px 80px rgba(20,40,30,.35), inset 0 0 0 2px #333",
      position: "relative",
    }}
  >
    <div
      style={{
        width: 390,
        height: 840,
        borderRadius: 46,
        overflow: "hidden",
        background: c.bg,
        color: c.ink,
        fontFamily: font,
        fontSize: 16,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", fontSize: 14, fontWeight: 600 }}>
        <span>9:41</span>
        <span style={{ width: 110, height: 28, borderRadius: 20, background: "#111", position: "absolute", left: 140, top: 8 }} />
        <span>●●● ▮</span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", padding: padded ? "8px 12px" : 0, position: "relative" }}>{children}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: c.green, paddingBottom: 18 }}>
        {(["Sight", "Map", "Navigate", "Settings"] as TabName[]).map((t) => (
          <div
            key={t}
            style={{
              textAlign: "center",
              padding: "16px 0",
              fontWeight: 600,
              fontSize: 15,
              color: t === tab ? "#fff" : "#cfe5d6",
              boxShadow: t === tab ? `inset 0 -4px 0 ${c.tabAmber}` : undefined,
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// A finger tap: a ring that grows and fades, drawn over the screen at (x, y) in screen px.
export const Tap: React.FC<{ x: number; y: number; progress: number }> = ({ x, y, progress }) => {
  if (progress <= 0 || progress >= 1) return null;
  const r = 18 + progress * 40;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: "50%",
        background: "rgba(245,158,11,.25)",
        border: "3px solid rgba(245,158,11,.9)",
        opacity: 1 - progress,
        zIndex: 50,
      }}
    />
  );
};
