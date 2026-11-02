namespace HikeLoc.Core;

public readonly record struct LatLon(double Lat, double Lon);

/// <summary>Spherical-earth helpers. Accurate to well under 0.5% at hiking distances.</summary>
public static class GeoMath
{
    public const double EarthRadiusM = 6_371_008.8;

    static double Rad(double deg) => deg * Math.PI / 180.0;
    static double Deg(double rad) => rad * 180.0 / Math.PI;

    /// <summary>Normalizes an angle to [0, 360).</summary>
    public static double Normalize360(double deg)
    {
        deg %= 360.0;
        return deg < 0 ? deg + 360.0 : deg;
    }

    /// <summary>Signed shortest rotation from <paramref name="from"/> to <paramref name="to"/>, in (-180, 180].</summary>
    public static double AngleDiff(double from, double to)
    {
        var d = (to - from + 540.0) % 360.0 - 180.0;
        return d <= -180.0 ? d + 360.0 : d;
    }

    /// <summary>Great-circle distance in metres (haversine).</summary>
    public static double Distance(LatLon a, LatLon b)
    {
        var dLat = Rad(b.Lat - a.Lat);
        var dLon = Rad(b.Lon - a.Lon);
        var h = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(Rad(a.Lat)) * Math.Cos(Rad(b.Lat)) * Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        return 2 * EarthRadiusM * Math.Asin(Math.Min(1.0, Math.Sqrt(h)));
    }

    /// <summary>Initial true bearing from a to b, degrees clockwise from north [0, 360).</summary>
    public static double Bearing(LatLon a, LatLon b)
    {
        var φ1 = Rad(a.Lat);
        var φ2 = Rad(b.Lat);
        var Δλ = Rad(b.Lon - a.Lon);
        var y = Math.Sin(Δλ) * Math.Cos(φ2);
        var x = Math.Cos(φ1) * Math.Sin(φ2) - Math.Sin(φ1) * Math.Cos(φ2) * Math.Cos(Δλ);
        return Normalize360(Deg(Math.Atan2(y, x)));
    }

    /// <summary>Local tangent-plane offset (east, north) in metres of <paramref name="p"/> relative to <paramref name="origin"/>.</summary>
    public static (double East, double North) ToLocal(LatLon origin, LatLon p)
    {
        var north = Rad(p.Lat - origin.Lat) * EarthRadiusM;
        var east = Rad(p.Lon - origin.Lon) * EarthRadiusM * Math.Cos(Rad(origin.Lat));
        return (east, north);
    }

    /// <summary>Inverse of <see cref="ToLocal"/>.</summary>
    public static LatLon FromLocal(LatLon origin, double eastM, double northM)
    {
        var lat = origin.Lat + Deg(northM / EarthRadiusM);
        var lon = origin.Lon + Deg(eastM / (EarthRadiusM * Math.Cos(Rad(origin.Lat))));
        return new LatLon(lat, lon);
    }

    public static string FormatDistance(double metres) =>
        metres < 1000 ? $"{metres:0} m" : $"{metres / 1000:0.00} km";
}
