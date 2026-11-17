# Third-party notices

**HikeLoc** is © 2026 Per Hejndorf and is licensed under the [MIT License](LICENSE), except where stated below. This file lists the third-party components and assets it uses, each under its own licence. Licence texts and copyright notices are kept by the upstream projects at the *Source* links; where a licence requires its notice to travel with binaries, the upstream package already carries it.

_Last reviewed: 2026-11-17. Versions are the ones resolved in this repository at that date; Dependabot keeps them current, so check the project files for the exact version of a given release._

## Libraries included in the application

| Library | Version | Licence | Source | Modified |
|---|---|---|---|---|
| .NET runtime and Blazor WebAssembly (shipped in `_framework/`) | 10.0 | MIT | [dotnet/runtime](https://github.com/dotnet/runtime), [dotnet/aspnetcore](https://github.com/dotnet/aspnetcore) | No |
| Microsoft.AspNetCore.Components.WebAssembly | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Components.WebAssembly/10.0.0) | No |
| Leaflet (vendored in `HikeLoc/wwwroot/lib/leaflet`) | 1.9.4 | BSD-2-Clause | [Leaflet/Leaflet](https://github.com/Leaflet/Leaflet) | No |

<details>
<summary>Indirect (transitive) dependencies — 25 packages</summary>

These packages are pulled in by the libraries above and are shipped with the application. All are used unmodified.

| Library | Version | Licence | Source | Modified |
|---|---|---|---|---|
| Microsoft.AspNetCore.Authorization | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Authorization/10.0.0) | No |
| Microsoft.AspNetCore.Components | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Components/10.0.0) | No |
| Microsoft.AspNetCore.Components.Forms | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Components.Forms/10.0.0) | No |
| Microsoft.AspNetCore.Components.Web | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Components.Web/10.0.0) | No |
| Microsoft.AspNetCore.Metadata | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Metadata/10.0.0) | No |
| Microsoft.Extensions.Configuration | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Configuration/10.0.0) | No |
| Microsoft.Extensions.Configuration.Abstractions | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Abstractions/10.0.0) | No |
| Microsoft.Extensions.Configuration.Binder | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Binder/10.0.0) | No |
| Microsoft.Extensions.Configuration.FileExtensions | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.FileExtensions/10.0.0) | No |
| Microsoft.Extensions.Configuration.Json | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Json/10.0.0) | No |
| Microsoft.Extensions.DependencyInjection | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.DependencyInjection/10.0.0) | No |
| Microsoft.Extensions.DependencyInjection.Abstractions | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.DependencyInjection.Abstractions/10.0.0) | No |
| Microsoft.Extensions.Diagnostics | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Diagnostics/10.0.0) | No |
| Microsoft.Extensions.Diagnostics.Abstractions | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Diagnostics.Abstractions/10.0.0) | No |
| Microsoft.Extensions.FileProviders.Abstractions | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.FileProviders.Abstractions/10.0.0) | No |
| Microsoft.Extensions.FileProviders.Physical | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.FileProviders.Physical/10.0.0) | No |
| Microsoft.Extensions.FileSystemGlobbing | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.FileSystemGlobbing/10.0.0) | No |
| Microsoft.Extensions.Logging | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Logging/10.0.0) | No |
| Microsoft.Extensions.Logging.Abstractions | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Logging.Abstractions/10.0.0) | No |
| Microsoft.Extensions.Options | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Options/10.0.0) | No |
| Microsoft.Extensions.Options.ConfigurationExtensions | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Options.ConfigurationExtensions/10.0.0) | No |
| Microsoft.Extensions.Primitives | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Primitives/10.0.0) | No |
| Microsoft.Extensions.Validation | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.Extensions.Validation/10.0.0) | No |
| Microsoft.JSInterop | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.JSInterop/10.0.0) | No |
| Microsoft.JSInterop.WebAssembly | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.JSInterop.WebAssembly/10.0.0) | No |

</details>

## Build, test and tooling (not distributed)

Used to build, test or render promotional material only; not part of the shipped application.

| Library | Version | Licence | Source | Modified |
|---|---|---|---|---|
| Microsoft.NET.Test.Sdk | 17.11.1 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.NET.Test.Sdk/17.11.1) · [source](https://github.com/microsoft/vstest) | No |
| xunit | 2.9.2 | Apache-2.0 | [NuGet](https://www.nuget.org/packages/xunit/2.9.2) · [source](https://github.com/xunit/xunit) | No |
| xunit.runner.visualstudio | 2.8.2 | Apache-2.0 | [NuGet](https://www.nuget.org/packages/xunit.runner.visualstudio/2.8.2) · [source](https://github.com/xunit/visualstudio.xunit) | No |
| Microsoft.AspNetCore.Components.WebAssembly.DevServer | 10.0.0 | MIT | [NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Components.WebAssembly.DevServer/10.0.0) | No |
| @remotion/cli (`video/`) | 4.0.530 | Remotion License (free for individuals and companies of up to 3 people) | [npm](https://www.npmjs.com/package/@remotion/cli/v/4.0.530) | No |
| @remotion/media-utils (`video/`) | 4.0.530 | MIT | [npm](https://www.npmjs.com/package/@remotion/media-utils/v/4.0.530) | No |
| react (`video/`) | 19.1.0 | MIT | [npm](https://www.npmjs.com/package/react/v/19.1.0) | No |
| react-dom (`video/`) | 19.1.0 | MIT | [npm](https://www.npmjs.com/package/react-dom/v/19.1.0) | No |
| remotion (`video/`) | 4.0.530 | Remotion License (free for individuals and companies of up to 3 people) | [npm](https://www.npmjs.com/package/remotion/v/4.0.530) | No |
| @types/react (`video/`) | 19.1.8 | MIT | [npm](https://www.npmjs.com/package/@types/react/v/19.1.8) | No |
| typescript (`video/`) | 5.8.3 | Apache-2.0 | [npm](https://www.npmjs.com/package/typescript/v/5.8.3) | No |

## Fonts, data and online services

These are used at run time but are not bundled in this repository. Their own terms apply.

| Service | Used for | Terms | Source |
|---|---|---|---|
| OpenStreetMap tiles | Background map tiles, loaded at run time | Map data © OpenStreetMap contributors, ODbL 1.0; tiles subject to the OSMF Tile Usage Policy | [www.openstreetmap.org](https://www.openstreetmap.org/copyright) |
| Thunderforest | Optional topographic map tiles (user-supplied API key) | Maps © Thunderforest, data © OpenStreetMap contributors; Thunderforest terms of service | [www.thunderforest.com](https://www.thunderforest.com/terms/) |
| NOAA magnetic field calculator | Link only (to look up magnetic declination) | US Government work | [www.ngdc.noaa.gov](https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml) |

## Icons, images, audio and video

| Asset(s) | Origin | Licence |
|---|---|---|
| `HikeLoc/wwwroot/favicon.ico`, `HikeLoc/wwwroot/icons/` (8 files: .png), `images/banner.png` | AI-generated by the author with an image-generation tool, then edited/resized by the author | MIT (as part of this project) |
| `HikeLoc/wwwroot/lib/leaflet/images/` (5 files: .png) | Leaflet 1.9.4 marker and control images | BSD-2-Clause (Leaflet) |
| `video/assets/Per.jpg` | Portrait photograph of the author | © Per Hejndorf, all rights reserved. **Not covered by the MIT License.** |
| `video/assets/claude-ai-logo-rounded-hd-free-png.png` | Claude logo, used in the video's "Made with Claude" credit | Trademark of Anthropic PBC; used only to identify the tool. **Not covered by the MIT License.** |
| `video/assets/fma.png` | Free Music Archive logo, used in the video's music credit | Trademark of its owner; used only to credit the music source. **Not covered by the MIT License.** |
| `video/assets/icon.png` | HikeLoc app icon, AI-generated by the author | MIT (as part of this project) |

- The how-to video (`video/`) is rendered with Remotion. Its soundtrack, "Saudade Nostalgia" by Maxim Novak (Free Music Archive, CC BY-NC-ND), is **not** included in this repository (the MP3 is git-ignored) and is credited in the video.

AI-generated images and audio were created for this project by the author. Purely AI-generated material may not be protected by copyright in some jurisdictions; to the extent it is, the licence in the table applies.

## Trademarks

Microsoft, Windows, .NET, Blazor and other Microsoft product names are trademarks of the Microsoft group of companies. All other product names, logos and brands mentioned in this repository are the property of their respective owners. They are used only to identify the services and tools this project works with, and their use does not imply endorsement.
