# Renders the app icon in every size into HikeLoc/wwwroot/icons:
# a snow-capped peak (C) on the app's forest green, with two amber sight lines from A and B meeting at the summit.
#   powershell -File tools\make-icons.ps1
Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot "..\HikeLoc\wwwroot\icons"
New-Item -ItemType Directory -Force $out | Out-Null

function New-RoundedRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $path
}

function Color([int]$rgb) { [System.Drawing.Color]::FromArgb(0xFF, ($rgb -shr 16) -band 0xFF, ($rgb -shr 8) -band 0xFF, $rgb -band 0xFF) }

# $scale is the artwork's share of the icon; maskable icons keep it inside the safe zone.
# $rounded gives the background its own rounded corners (favicons, manifest); iOS and maskable icons are rounded by the OS.
# $small drops the details that turn to mush at favicon sizes.
function New-Icon([int]$size, [double]$scale = 1.0, [bool]$rounded = $false, [bool]$small = $false) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = "AntiAlias"
    $g.InterpolationMode = "HighQualityBicubic"
    $g.Clear([System.Drawing.Color]::Transparent)

    $rect = New-Object System.Drawing.RectangleF 0, 0, $size, $size
    $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, (Color 0x1F7A45), (Color 0x0C3A1F), 90
    if ($rounded) {
        $clip = New-RoundedRect 0 0 $size $size ($size * 0.2)
        $g.FillPath($bg, $clip)
        $g.SetClip($clip)
    } else {
        $g.FillRectangle($bg, $rect)
    }

    # Artwork coordinates are 0..1, centred and scaled into the icon.
    $off = $size * (1 - $scale) / 2
    $k = $size * $scale
    function P([double]$x, [double]$y) { New-Object System.Drawing.PointF ([float]($off + $x * $k)), ([float]($off + $y * $k)) }
    function Fill($color, [object[]]$pts) { $g.FillPolygon((New-Object System.Drawing.SolidBrush $color), [System.Drawing.PointF[]]$pts) }

    # Sun behind the ridge.
    if (-not $small) {
        $sun = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(0x30, 0xFF, 0xF7, 0xE0))
        $c = P 0.76 0.26; $r = 0.09 * $k
        $g.FillEllipse($sun, $c.X - $r, $c.Y - $r, 2 * $r, 2 * $r)
    }

    # Back ridge, then the main peak with a lit and a shaded face and a snow cap.
    # The ridge and floor run past 0..1 so they reach the edges of maskable icons too.
    Fill (Color 0x2F8A55) @((P -1.0 0.78), (P 0.02 0.78), (P 0.26 0.48), (P 0.40 0.62), (P 0.50 0.54), (P 0.98 0.78), (P 2.0 0.78))
    Fill (Color 0xD7E4DA) @((P 0.16 0.78), (P 0.52 0.24), (P 0.52 0.78))
    Fill (Color 0xA9BFB0) @((P 0.52 0.24), (P 0.88 0.78), (P 0.52 0.78))
    Fill (Color 0xFFFFFF) @((P 0.52 0.24), (P 0.405 0.415), (P 0.45 0.39), (P 0.49 0.43), (P 0.52 0.39))
    Fill (Color 0xE6EEE8) @((P 0.52 0.24), (P 0.52 0.39), (P 0.56 0.42), (P 0.60 0.38), (P 0.635 0.415))

    # Valley floor.
    Fill (Color 0x14532D) @((P -1.0 0.76), (P 2.0 0.76), (P 2.0 2.0), (P -1.0 2.0))

    # Sight lines from A and B to the summit.
    $amber = Color 0xF59E0B
    $a = P 0.22 0.86; $b = P 0.84 0.86; $top = P 0.52 0.24
    $pen = New-Object System.Drawing.Pen $amber, ([float][Math]::Max(1.2, $k * 0.032))
    $pen.StartCap = "Round"; $pen.EndCap = "Round"
    $g.DrawLine($pen, $a, $top)
    $g.DrawLine($pen, $b, $top)

    # A and B, and a target ring on C.
    $dot = New-Object System.Drawing.SolidBrush $amber
    $r = [Math]::Max(1.2, $k * 0.05)
    foreach ($p in $a, $b) { $g.FillEllipse($dot, $p.X - $r, $p.Y - $r, 2 * $r, 2 * $r) }
    $ring = New-Object System.Drawing.Pen $amber, ([float][Math]::Max(1.0, $k * 0.026))
    $r = $k * 0.065
    $g.DrawEllipse($ring, $top.X - $r, $top.Y - $r, 2 * $r, 2 * $r)

    $g.Dispose()
    $bmp
}

function Save-Png($bmp, [string]$name) {
    $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

# iOS home screen (opaque, square: iOS rounds the corners itself).
Save-Png (New-Icon 180) "apple-touch-icon.png"
Save-Png (New-Icon 167) "apple-touch-icon-167.png"
Save-Png (New-Icon 152) "apple-touch-icon-152.png"

# Web app manifest (Windows/Android install) and a big master copy.
Save-Png (New-Icon 1024) "icon-1024.png"
Save-Png (New-Icon 512 1.0 $true) "icon-512.png"
Save-Png (New-Icon 192 1.0 $true) "icon-192.png"
Save-Png (New-Icon 512 0.8) "icon-512-maskable.png"

# Browser tab: no sun so it reads at 16 px.
Save-Png (New-Icon 32 1.0 $true $true) "favicon-32.png"

# favicon.ico with 16, 32 and 48 px PNG images, for Windows and older browsers.
$images = foreach ($s in 16, 32, 48) {
    $bmp = New-Icon $s 1.0 $true $true
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    [pscustomobject]@{ Size = $s; Bytes = $ms.ToArray() }
}
$ico = New-Object System.IO.MemoryStream
$wr = New-Object System.IO.BinaryWriter $ico
$wr.Write([uint16]0); $wr.Write([uint16]1); $wr.Write([uint16]$images.Count)
$offset = 6 + 16 * $images.Count
foreach ($img in $images) {
    $wr.Write([byte]$img.Size); $wr.Write([byte]$img.Size); $wr.Write([byte]0); $wr.Write([byte]0)
    $wr.Write([uint16]1); $wr.Write([uint16]32)
    $wr.Write([uint32]$img.Bytes.Length); $wr.Write([uint32]$offset)
    $offset += $img.Bytes.Length
}
foreach ($img in $images) { $wr.Write($img.Bytes) }
$wr.Flush()
[System.IO.File]::WriteAllBytes((Join-Path $out "..\favicon.ico"), $ico.ToArray())

Write-Host "Icons written to $out"
