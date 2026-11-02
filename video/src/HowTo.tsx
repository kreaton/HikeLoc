import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Diagram } from "./Diagram";
import { Phone, Tap, TabName } from "./Phone";
import { MapScreen, NavScreen, SettingsScreen, SightScreen } from "./screens";
import { c, font } from "./theme";
import { Hiking, Sailing } from "./UseCases";

// Scene lengths in frames at 30 fps. HowTo's duration is their sum.
const scenes = {
  intro: 150,
  uses: 360,
  idea: 360,
  settings: 240,
  start: 210,
  recordA: 330,
  walk: 270,
  recordB: 360,
  map: 270,
  nav: 420,
  tips: 330,
  outro: 180,
  credits: 270,
};
export const totalFrames = Object.values(scenes).reduce((a, b) => a + b, 0);

const ease = Easing.bezier(0.33, 0, 0.2, 1);
// 0..1 progress between frames a and b.
const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const tap = (f: number, at: number) => (f - at) / 18;

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12, dur - 12, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Caption: React.FC<{ step?: number; title: string; children?: React.ReactNode }> = ({ step, title, children }) => {
  const f = useCurrentFrame();
  const p = prog(f, 4, 24);
  return (
    <div style={{ width: 820, fontFamily: font, color: c.ink, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      {step !== undefined && (
        <div
          style={{
            display: "inline-block",
            background: c.green,
            color: "#fff",
            fontWeight: 700,
            fontSize: 26,
            borderRadius: 30,
            padding: "8px 22px",
            marginBottom: 22,
            letterSpacing: ".04em",
          }}
        >
          STEP {step}
        </div>
      )}
      <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginBottom: 26, color: c.green }}>{title}</div>
      <div style={{ fontSize: 36, lineHeight: 1.4, color: "#33443a" }}>{children}</div>
    </div>
  );
};

// A body text that swaps at given frames, with a short cross-fade.
const Beats: React.FC<{ beats: [number, React.ReactNode][] }> = ({ beats }) => {
  const f = useCurrentFrame();
  let i = 0;
  beats.forEach(([at], j) => {
    if (f >= at) i = j;
  });
  const [at, node] = beats[i];
  const o = i === 0 ? 1 : prog(f, at, at + 12);
  return <div style={{ opacity: o, minHeight: 200 }}>{node}</div>;
};

const PhoneScene: React.FC<{ tab: TabName; padded?: boolean; screen: React.ReactNode; children: React.ReactNode }> = ({
  tab,
  padded,
  screen,
  children,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 22);
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center" }}>
      <div style={{ marginLeft: 230, transform: `translateY(${(1 - p) * 60}px)`, opacity: p }}>
        <Phone tab={tab} padded={padded}>
          {screen}
        </Phone>
      </div>
      <div style={{ marginLeft: 150 }}>{children}</div>
    </AbsoluteFill>
  );
};

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 30%, #fbfaf5 0%, ${c.bg} 55%, #e9e5d6 100%)` }}>
    <svg width={1920} height={1080} style={{ position: "absolute", opacity: 0.35 }}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ellipse key={i} cx={1650} cy={980} rx={260 + i * 120} ry={170 + i * 85} fill="none" stroke="#c9c2a8" strokeWidth={2} />
      ))}
    </svg>
  </AbsoluteFill>
);

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const icon = prog(f, 5, 35);
  const text = prog(f, 25, 55);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <Img
        src={staticFile("icon.png")}
        style={{ width: 300, height: 300, borderRadius: 66, boxShadow: "0 30px 60px rgba(20,60,35,.3)", transform: `scale(${0.6 + 0.4 * icon})`, opacity: icon }}
      />
      <div style={{ opacity: text, transform: `translateY(${(1 - text) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 120, fontWeight: 800, color: c.green, marginTop: 40 }}>HikeLoc</div>
        <div style={{ fontSize: 42, color: c.muted }}>Find a landscape feature from two sightings, then walk to it.</div>
      </div>
    </AbsoluteFill>
  );
};

const Uses: React.FC = () => {
  const f = useCurrentFrame();
  const panels: [string, React.ReactNode, React.ReactNode, number][] = [
    ["Hiking", <Hiking line={prog(f, 70, 120)} />, <>Find a summit, a cairn or a hut you can see across the valley, then walk to it.</>, 20],
    ["Sailing", <Sailing t={f} line={prog(f, 130, 180)} />, <>Pin down a headland, a lighthouse or an anchorage from two points along your course, then steer for it.</>, 80],
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <div style={{ opacity: prog(f, 0, 20), fontSize: 72, fontWeight: 800, color: c.green, marginBottom: 50 }}>
        Made for hiking and sailing
      </div>
      <div style={{ display: "flex", gap: 70 }}>
        {panels.map(([title, art, text, at]) => {
          const p = prog(f, at, at + 30);
          return (
            <div key={title} style={{ width: 760, opacity: p, transform: `translateY(${(1 - p) * 50}px)` }}>
              <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 24px 50px rgba(20,60,35,.22)", height: 460 }}>{art}</div>
              <div style={{ fontSize: 46, fontWeight: 800, color: c.ink, marginTop: 30 }}>{title}</div>
              <div style={{ fontSize: 32, lineHeight: 1.4, color: "#33443a", marginTop: 8 }}>{text}</div>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: prog(f, 220, 250), fontSize: 34, color: c.muted, marginTop: 44 }}>
        Same method on land and at sea: two sightings, one fix.
      </div>
    </AbsoluteFill>
  );
};

const Idea: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center" }}>
      <div style={{ marginLeft: 120 }}>
        <Diagram lineA={prog(f, 30, 80)} walk={prog(f, 120, 200)} lineB={prog(f, 205, 250)} cross={prog(f, 255, 300)} width={950} />
      </div>
      <div style={{ marginLeft: 40 }}>
        <Caption title="How it works">
          <Beats
            beats={[
              [0, <>Stand at <b style={{ color: c.pinA }}>A</b> and point your phone at a feature <b style={{ color: c.pinC }}>C</b>: a hilltop, a church tower, a mast.</>],
              [110, <>Walk sideways to <b style={{ color: c.pinB }}>B</b> and point at the same feature again.</>],
              [250, <>The two sight lines cross at <b style={{ color: c.pinC }}>C</b>. HikeLoc tells you where that is, how far away it is, and guides you there.</>],
            ]}
          />
        </Caption>
      </div>
    </AbsoluteFill>
  );
};

const Settings: React.FC = () => {
  const f = useCurrentFrame();
  const typed = f < 70 ? "4.5".slice(0, 0) : f < 80 ? "4" : f < 90 ? "4." : "4.5";
  return (
    <PhoneScene tab="Settings" screen={<SettingsScreen declination={f < 60 ? "0" : typed} focus={f >= 50 && f < 210} />}>
      <Caption step={1} title="Set the declination">
        On the <b>Settings</b> tab, enter the magnetic declination for your area: about <b>4.5° east</b> in Denmark. A wrong value shifts every result.
      </Caption>
    </PhoneScene>
  );
};

const Start: React.FC = () => {
  const f = useCurrentFrame();
  const running = f >= 80;
  const gps = Math.round(interpolate(f, [80, 160], [38, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <PhoneScene
      tab="Sight"
      screen={
        <>
          <SightScreen running={running} gps={gps} heading={40 + 8 * Math.sin(f / 9)} pressed={f >= 70 && f < 80 ? "start" : undefined} highlight={f >= 30 && f < 70 ? "start" : undefined} />
          <Tap x={195} y={128}progress={tap(f, 70)} />
        </>
      }
    >
      <Caption step={2} title="Start the sensors">
        On the <b>Sight</b> tab, tap <b>Start GPS &amp; compass</b> and allow location and compass access. Wait until GPS shows a few metres.
      </Caption>
    </PhoneScene>
  );
};

const RecordA: React.FC = () => {
  const f = useCurrentFrame();
  const settle = interpolate(f, [0, 110], [14, 1.5], { extrapolateRight: "clamp" });
  const heading = 27 + settle * Math.sin(f / 7);
  const busy = f >= 125 && f < 185;
  const done = f >= 185;
  return (
    <PhoneScene
      tab="Sight"
      screen={
        <>
          <SightScreen running gps={5} heading={heading} aDone={done} busy={busy} message={done ? "A recorded." : undefined} pressed={f >= 120 && f < 128 ? "A" : undefined} highlight={f >= 60 && f < 120 ? "A" : undefined} />
          <Tap x={195} y={346}progress={tap(f, 120)} />
        </>
      }
    >
      <Caption step={3} title="Record A">
        <Beats
          beats={[
            [0, <>Hold the phone <b>flat like a compass</b>, with the <b>top edge pointing at C</b>.</>],
            [100, <>Hold steady and tap <b>Record A</b>. HikeLoc averages the compass for a moment and stores your position and bearing.</>],
          ]}
        />
      </Caption>
    </PhoneScene>
  );
};

const Walk: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center" }}>
      <div style={{ marginLeft: 120 }}>
        <Diagram lineA={1} walk={prog(f, 20, 130)} lineB={prog(f, 135, 175)} cross={0} angle={prog(f, 180, 230)} width={950} />
      </div>
      <div style={{ marginLeft: 40 }}>
        <Caption step={4} title="Walk sideways to B">
          Go far enough to the side that the two sight lines meet at a <b>wide angle</b>, ideally <b>45–90°</b>. Shallow angles give a poor fix, and the app warns you about them.
        </Caption>
      </div>
    </AbsoluteFill>
  );
};

const RecordB: React.FC = () => {
  const f = useCurrentFrame();
  const heading = 328 + interpolate(f, [0, 80], [9, 1], { extrapolateRight: "clamp" }) * Math.sin(f / 7);
  const busy = f >= 95 && f < 155;
  const done = f >= 155;
  return (
    <PhoneScene
      tab="Sight"
      screen={
        <>
          <SightScreen
            running
            gps={4}
            heading={heading}
            aDone
            bDone={done}
            busy={busy}
            showC={done}
            message={done ? "B recorded." : undefined}
            pressed={f >= 90 && f < 98 ? "B" : undefined}
            highlight={f >= 40 && f < 90 ? "B" : f >= 225 ? "C" : undefined}
            scroll={interpolate(f, [175, 220], [0, 330], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })}
          />
          <Tap x={195} y={496}progress={tap(f, 90)} />
        </>
      }
    >
      <Caption step={5} title="Record B">
        <Beats
          beats={[
            [0, <>Point at the same feature from B and tap <b>Record B</b>.</>],
            [190, <><b>Feature C</b> appears: its distance and bearing from A and B, its position, and how far it could be off.</>],
          ]}
        />
      </Caption>
    </PhoneScene>
  );
};

const MapScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <PhoneScene tab="Map" padded={false} screen={<MapScreen lines={prog(f, 70, 170)} pins={prog(f, 15, 80)} layer={f < 190 ? "Street" : "Cycle"} />}>
      <Caption step={6} title="See it on the map">
        The <b>Map</b> tab shows <b style={{ color: c.pinA }}>A</b>, <b style={{ color: c.pinB }}>B</b>, <b style={{ color: c.pinC }}>C</b> and you. Switch between the street and cycle maps; the cycle map needs a free Thunderforest key in Settings.
      </Caption>
    </PhoneScene>
  );
};

const Nav: React.FC = () => {
  const f = useCurrentFrame();
  const heading = interpolate(f, [90, 250], [80, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }) + 2 * Math.sin(f / 11);
  const metres = interpolate(f, [60, 420], [1309, 1262]);
  return (
    <PhoneScene
      tab="Navigate"
      screen={
        <>
          <NavScreen target={f >= 58 ? "C" : undefined} relative={10 - heading} distance={`${(metres / 1000).toFixed(2)} km`} bearing={10} heading={heading} pressed={f >= 50 && f < 58} />
          <Tap x={310} y={80}progress={tap(f, 50)} />
        </>
      }
    >
      <Caption step={7} title="Navigate to C">
        <Beats
          beats={[
            [0, <>On the <b>Navigate</b> tab, pick <b>A</b>, <b>B</b> or <b>C</b>. You get the live distance and an arrow.</>],
            [120, <>Turn until the arrow points straight up. It turns <b style={{ color: c.good }}>green</b> when you're on course. Then walk.</>],
          ]}
        />
      </Caption>
    </PhoneScene>
  );
};

const Tips: React.FC = () => {
  const f = useCurrentFrame();
  const tips = [
    ["🧭", "Calibrate the compass with a figure-eight. Keep away from metal, magnets, power lines and, on a boat, the engine."],
    ["✍️", "Have a real compass? Type its bearing on the Sight tab instead of using the phone's."],
    ["📐", "A wider angle between the sight lines means a smaller uncertainty."],
    ["🔋", "Stop the sensors when you don't need them, to save battery."],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 230, fontFamily: font }}>
      <Caption title="Tips for a good fix" />
      {tips.map(([icon, text], i) => {
        const p = prog(f, 30 + i * 45, 50 + i * 45);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, margin: "16px 0", opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
            <div style={{ width: 84, height: 84, borderRadius: 22, background: "#fff", border: `2px solid ${c.line}`, display: "grid", placeItems: "center", fontSize: 44 }}>{icon}</div>
            <div style={{ fontSize: 38, color: c.ink, maxWidth: 1300 }}>{text}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 30);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: font, opacity: p }}>
      <Img src={staticFile("icon.png")} style={{ width: 220, height: 220, borderRadius: 48, boxShadow: "0 30px 60px rgba(20,60,35,.3)" }} />
      <div style={{ fontSize: 96, fontWeight: 800, color: c.green, marginTop: 34 }}>HikeLoc</div>
      <div style={{ fontSize: 38, color: c.muted, textAlign: "center", lineHeight: 1.45 }}>
        Add it to your home screen. It works without signal;
        <br />
        only the map tiles need a connection.
      </div>
    </AbsoluteFill>
  );
};

const Credits: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string, React.CSSProperties, string, React.ReactNode][] = [
    ["Per.jpg", "App and video", { borderRadius: "50%", border: `4px solid ${c.line}` }, "Per Hejndorf", null],
    ["claude-ai-logo-rounded-hd-free-png.png", "Made with", { background: "transparent" }, "Claude by Anthropic", null],
    ["fma.png", "Music", { borderRadius: 24, border: `2px solid ${c.line}` }, "“Saudade Nostalgia” by Maxim Novak", "Source: Free Music Archive · License: CC BY-NC-ND"],
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <div>
        {rows.map(([img, k, imgStyle, v, small], i) => {
          const p = prog(f, 10 + i * 25, 35 + i * 25);
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 44, margin: "34px 0", opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
              <Img src={staticFile(img)} style={{ width: 170, height: 170, objectFit: "cover", background: "#fff", ...imgStyle }} />
              <div>
                <div style={{ fontSize: 26, letterSpacing: ".12em", textTransform: "uppercase", color: c.muted, marginBottom: 6 }}>{k}</div>
                <div style={{ fontSize: 52, fontWeight: 700, color: c.green, lineHeight: 1.25 }}>{v}</div>
                {small && <div style={{ fontSize: 30, color: c.muted, marginTop: 6 }}>{small}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const order: [keyof typeof scenes, React.FC][] = [
  ["intro", Intro],
  ["uses", Uses],
  ["idea", Idea],
  ["settings", Settings],
  ["start", Start],
  ["recordA", RecordA],
  ["walk", Walk],
  ["recordB", RecordB],
  ["map", MapScene],
  ["nav", Nav],
  ["tips", Tips],
  ["outro", Outro],
  ["credits", Credits],
];

export const HowTo: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{ fontFamily: font }}>
      <Backdrop />
      <Audio
        src={staticFile("Maxim Novak - 09 Saudade Nostalgia.mp3")}
        volume={(f) => interpolate(f, [0, 30, durationInFrames - 120, durationInFrames], [0, 0.8, 0.8, 0], { extrapolateRight: "clamp" })}
      />
      {order.map(([name, Scene]) => {
        const dur = scenes[name];
        const seq = (
          <Sequence key={name} from={from} durationInFrames={dur} name={name}>
            <Fade dur={dur}>
              <Scene />
            </Fade>
          </Sequence>
        );
        from += dur;
        return seq;
      })}
    </AbsoluteFill>
  );
};
