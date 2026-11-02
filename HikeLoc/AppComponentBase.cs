using HikeLoc.Services;
using Microsoft.AspNetCore.Components;

namespace HikeLoc;

/// <summary>Base for tab components: injects shared services and re-renders on any state or sensor change.</summary>
public abstract class AppComponentBase : ComponentBase, IDisposable
{
    [Inject] protected AppState State { get; set; } = default!;
    [Inject] protected SensorService Sensors { get; set; } = default!;

    protected override void OnInitialized()
    {
        State.Changed += Refresh;
        Sensors.Changed += Refresh;
    }

    void Refresh() => _ = InvokeAsync(StateHasChanged);

    /// <summary>Compass heading corrected to true north, or null when there is no compass reading.</summary>
    protected double? TrueHeading =>
        Sensors.Heading is { } h ? HikeLoc.Core.GeoMath.Normalize360(h + State.Declination) : null;

    public virtual void Dispose()
    {
        State.Changed -= Refresh;
        Sensors.Changed -= Refresh;
    }
}
