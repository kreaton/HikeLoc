# HikeLoc

A small hiking navigation aid, built as a .NET Blazor WebAssembly PWA for use on a phone.

**Workflow**

1. At **A**, point the phone at a landscape feature **C**, tap *Record A* (position + compass bearing are stored).
2. Walk to **B**, sight the same feature, tap *Record B*.
3. HikeLoc intersects the two sight lines to get C's position, distance and bearing from A and B, and an uncertainty estimate.
4. The **Map** tab shows A, B, C and you on OpenStreetMap or the Thunderforest OpenCycleMap.
5. The **Navigate** tab picks A, B or C and shows a live distance and a direction arrow as you point the phone.

## Layout

| Project | What it is |
|---|---|
| `HikeLoc.Core` | Pure C#: geodesy, triangulation, `Sighting` model. No browser dependencies. |
| `HikeLoc.Tests` | xunit tests for the maths. |
| `HikeLoc` | Blazor WebAssembly standalone PWA (Razor UI, JS interop for GPS, compass and Leaflet). |

## Run

```bash
dotnet test                       # maths tests
dotnet run --project HikeLoc      # https://localhost:7180
```

**The phone sensors only work over HTTPS**, so `localhost` on your PC is not enough to test on a phone. Options:

- Publish and host on any static HTTPS host (GitHub Pages, Netlify, Azure Static Web Apps, Cloudflare Pages):
  `dotnet publish HikeLoc -c Release -o out` and upload `out/wwwroot`.
  If the site is served from a sub-path (GitHub Pages project sites), change `<base href="/" />` in `index.html` to that sub-path.
- Or tunnel the dev server (`cloudflared tunnel --url https://localhost:7180`, ngrok, VS Code port forwarding).

Then open the URL on the phone and use *Add to Home screen*. The published build caches the app so it starts without signal; map tiles still need a connection.

## Using it well

- Hold the phone **flat like a compass, top edge pointing at C**, steady for about a second. (Upright "camera style" works on Android; iOS reports the top-edge heading only.)
- Set **magnetic declination** on the Settings tab (default 4.5° east, roughly Denmark in 2026). Look up your location at <https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml>. A wrong value shifts everything.
- Phone compasses are typically good to 5-15° and are disturbed by metal, magnets (phone cases!) and power lines. Calibrate by drawing a figure-eight.
- With a real compass, type the bearings in on the Sight tab. Enter what the compass reads (magnetic); declination is applied as for the phone compass.
- Choose B so the two sight lines cross at a wide angle (ideally 45-90°). The app warns when they are shallow and shows an error estimate.
- For the cycle map, get a free key at <https://www.thunderforest.com/> and paste it on the Settings tab.

## Icons

The app icon (iOS home screen, Windows/Android install via the web app manifest, and the browser
favicon) is drawn by a script into `HikeLoc/wwwroot/icons` and `wwwroot/favicon.ico`:

```bash
powershell -File tools\make-icons.ps1
```

## Versioning

The version is `Major.Minor.Build`. Major and minor are set by hand in `Directory.Build.props`. The build number is the GitHub Actions run number (0 for local builds). The footer on the Settings tab shows the credits, the version, the build time (Danish time) and the git commit, for example `v1.0.7 · 26.10.2026 14:32 · a1b2c3d`.

## Video

`video/` holds a Remotion project that renders a how-to video of the app. See `video/README.md`.

## Notes

- Compass: Android uses `deviceorientationabsolute`; iOS uses `webkitCompassHeading` after a permission prompt. Headings are averaged (circular mean) over the capture window and the spread is stored with each sighting.
- State (sightings, settings, key) is kept in `localStorage`.
- Leaflet 1.9.4 is vendored in `wwwroot/lib/leaflet` so it is available offline.
