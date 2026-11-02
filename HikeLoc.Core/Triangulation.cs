namespace HikeLoc.Core;

public enum TriangulationStatus
{
    Ok,
    /// <summary>The two sight lines are (nearly) parallel, so C cannot be fixed.</summary>
    Parallel,
    /// <summary>The sight lines cross behind A or B, which means a bearing or position is wrong.</summary>
    Behind,
}

public sealed record TriangulationResult(
    TriangulationStatus Status,
    LatLon? C,
    double DistanceFromA,
    double DistanceFromB,
    double BearingFromA,
    double BearingFromB,
    double BaselineM,
    double IntersectionAngleDeg,
    double ErrorEstimateM);

public static class Triangulation
{
    /// <summary>
    /// Intersects the sight line from A (true bearing <paramref name="bearingA"/>) with the one from B.
    /// Works in a local flat-earth frame centred on A, which is fine for hiking distances.
    /// </summary>
    /// <param name="bearingSigmaDeg">Assumed 1-sigma compass error, used for the rough error estimate.</param>
    public static TriangulationResult Solve(LatLon a, double bearingA, LatLon b, double bearingB, double bearingSigmaDeg = 5.0)
    {
        var (bx, by) = GeoMath.ToLocal(a, b);
        var baseline = Math.Sqrt(bx * bx + by * by);

        var ra = bearingA * Math.PI / 180.0;
        var rb = bearingB * Math.PI / 180.0;
        // Unit direction vectors as (east, north).
        double dax = Math.Sin(ra), day = Math.Cos(ra);
        double dbx = Math.Sin(rb), dby = Math.Cos(rb);

        // Solve A + t*dA = B + s*dB, with cross(u, v) = u.x*v.y - u.y*v.x
        var crossDirs = dax * dby - day * dbx;          // = sin(angle between rays)
        var sinGamma = Math.Abs(crossDirs);
        // Report the true angle between the rays (0..180), not just the acute one.
        var dot = dax * dbx + day * dby;
        var angleBetween = Math.Acos(Math.Clamp(dot, -1.0, 1.0)) * 180.0 / Math.PI;

        if (sinGamma < 0.02) // under ~1.1 degrees
            return Failed(TriangulationStatus.Parallel, baseline, angleBetween);

        var t = (bx * dby - by * dbx) / crossDirs;
        var s = -(dax * by - day * bx) / crossDirs;

        if (t <= 0 || s <= 0)
            return Failed(TriangulationStatus.Behind, baseline, angleBetween);

        var c = GeoMath.FromLocal(a, t * dax, t * day);
        var sigma = bearingSigmaDeg * Math.PI / 180.0;
        var error = sigma * Math.Sqrt(t * t + s * s) / sinGamma;

        return new TriangulationResult(
            TriangulationStatus.Ok, c,
            GeoMath.Distance(a, c), GeoMath.Distance(b, c),
            GeoMath.Bearing(a, c), GeoMath.Bearing(b, c),
            baseline, angleBetween, error);

        static TriangulationResult Failed(TriangulationStatus status, double baseline, double angle) =>
            new(status, null, 0, 0, 0, 0, baseline, angle, double.PositiveInfinity);
    }
}
