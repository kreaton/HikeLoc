namespace HikeLoc.Core;

/// <summary>One recorded sighting: where you stood and which way the phone pointed (magnetic heading, from the phone compass or typed in from a real compass).</summary>
public sealed record Sighting(
    double Lat,
    double Lon,
    double AccuracyM,
    double MagneticHeading,
    double HeadingStdDev,
    int Samples,
    DateTimeOffset Time,
    bool Manual = false)
{
    public LatLon Position => new(Lat, Lon);
}
