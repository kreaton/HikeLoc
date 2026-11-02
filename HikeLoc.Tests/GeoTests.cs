using HikeLoc.Core;
using Xunit;

namespace HikeLoc.Tests;

public class GeoTests
{
    static readonly LatLon A = new(55.6761, 12.5683);

    [Fact]
    public void OneDegreeOfLatitudeIsAbout111Km()
    {
        var d = GeoMath.Distance(new LatLon(55, 12), new LatLon(56, 12));
        Assert.InRange(d, 111_000, 111_400);
    }

    [Theory]
    [InlineData(0, 10, 10)]
    [InlineData(350, 10, 20)]
    [InlineData(10, 350, -20)]
    [InlineData(0, 180, 180)]
    public void AngleDiffTakesShortestWay(double from, double to, double expected) =>
        Assert.Equal(expected, GeoMath.AngleDiff(from, to), 6);

    [Fact]
    public void BearingNorthAndEast()
    {
        Assert.Equal(0, GeoMath.Bearing(A, new LatLon(A.Lat + 0.01, A.Lon)), 3);
        Assert.InRange(GeoMath.Bearing(A, new LatLon(A.Lat, A.Lon + 0.01)), 89.9, 90.1);
    }

    [Fact]
    public void RecoversKnownFeature()
    {
        // C is 1.5 km north-east of A; B is 800 m east of A.
        var c = GeoMath.FromLocal(A, 1060, 1060);
        var b = GeoMath.FromLocal(A, 800, 0);

        var r = Triangulation.Solve(A, GeoMath.Bearing(A, c), b, GeoMath.Bearing(b, c));

        Assert.Equal(TriangulationStatus.Ok, r.Status);
        Assert.InRange(GeoMath.Distance(r.C!.Value, c), 0, 5);
        Assert.InRange(r.DistanceFromA, 1450, 1550);
    }

    [Fact]
    public void ParallelSightLinesAreRejected()
    {
        var b = GeoMath.FromLocal(A, 500, 0);
        var r = Triangulation.Solve(A, 0, b, 0);
        Assert.Equal(TriangulationStatus.Parallel, r.Status);
    }

    [Fact]
    public void LinesCrossingBehindAreRejected()
    {
        var b = GeoMath.FromLocal(A, 500, 0);
        // A looks north, B looks south-west: the lines only meet behind B.
        var r = Triangulation.Solve(A, 0, b, 200);
        Assert.Equal(TriangulationStatus.Behind, r.Status);
    }

    [Fact]
    public void ErrorGrowsWhenRaysAreShallow()
    {
        var c = GeoMath.FromLocal(A, 0, 2000);
        var wide = GeoMath.FromLocal(A, 1500, 0);
        var narrow = GeoMath.FromLocal(A, 100, 0);

        var rw = Triangulation.Solve(A, 0, wide, GeoMath.Bearing(wide, c));
        var rn = Triangulation.Solve(A, 0, narrow, GeoMath.Bearing(narrow, c));

        Assert.True(rn.ErrorEstimateM > rw.ErrorEstimateM * 3);
    }
}
