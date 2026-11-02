# HikeLoc how-to video

A ~1¾ minute instruction video made with [Remotion](https://www.remotion.dev/). The app's screens are
redrawn in React (`src/screens.tsx`, styled after `HikeLoc/wwwroot/css/app.css`) with one example hike,
so the numbers agree from scene to scene.

The music is not in the repository. Copy the track to `public/music.mp3` first:

```bash
cp "c:/Users/perhe/Downloads/Maxim Novak - 09 Saudade Nostalgia.mp3" public/music.mp3
```

Then:

```bash
npm install
npm run studio    # preview and scrub in the browser
npm run render    # writes out/hikeloc-howto.mp4
```

Scene order and lengths are in `src/HowTo.tsx` (`scenes`).
