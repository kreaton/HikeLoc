using System.Text.Json;
using HikeLoc.Core;
using Microsoft.JSInterop;

namespace HikeLoc.Services;

public enum Slot { A, B, C }

/// <summary>Shared app state: the two sightings, settings and the derived position of C. Persisted in localStorage.</summary>
public sealed class AppState
{
    const string StorageKey = "hikeloc.state.v1";

    readonly IJSRuntime _js;
    public AppState(IJSRuntime js) => _js = js;

    public Sighting? A { get; private set; }
    public Sighting? B { get; private set; }

    /// <summary>Magnetic declination in degrees, east positive. True bearing = magnetic + declination.</summary>
    public double Declination { get; set; } = 4.5;

    /// <summary>Assumed 1-sigma compass error (degrees) for the position uncertainty estimate.</summary>
    public double CompassSigma { get; set; } = 5.0;

    public string ThunderforestKey { get; set; } = "";
    public string BaseLayer { get; set; } = "osm"; // "osm" | "cycle"
    public Slot? Target { get; set; }

    public event Action? Changed;

    public double TrueBearing(Sighting s) => GeoMath.Normalize360(s.MagneticHeading + Declination);

    public TriangulationResult? Triangulate() =>
        A is null || B is null
            ? null
            : Triangulation.Solve(A.Position, TrueBearing(A), B.Position, TrueBearing(B), CompassSigma);

    public LatLon? PositionOf(Slot slot) => slot switch
    {
        Slot.A => A?.Position,
        Slot.B => B?.Position,
        _ => Triangulate() is { Status: TriangulationStatus.Ok } r ? r.C : null,
    };

    public async Task RecordAsync(Slot slot, Sighting sighting)
    {
        if (slot == Slot.A) A = sighting;
        else if (slot == Slot.B) B = sighting;
        await SaveAsync();
    }

    public async Task ResetAsync()
    {
        A = null;
        B = null;
        Target = null;
        await SaveAsync();
    }

    public async Task SaveAsync()
    {
        var dto = new Saved(A, B, Declination, CompassSigma, ThunderforestKey, BaseLayer, Target);
        try { await _js.InvokeVoidAsync("localStorage.setItem", StorageKey, JsonSerializer.Serialize(dto)); }
        catch (JSException) { /* storage blocked: keep working in memory */ }
        Changed?.Invoke();
    }

    public async Task LoadAsync()
    {
        try
        {
            var json = await _js.InvokeAsync<string?>("localStorage.getItem", StorageKey);
            if (string.IsNullOrWhiteSpace(json)) return;
            var dto = JsonSerializer.Deserialize<Saved>(json);
            if (dto is null) return;
            A = dto.A;
            B = dto.B;
            Declination = dto.Declination;
            CompassSigma = dto.CompassSigma;
            ThunderforestKey = dto.ThunderforestKey ?? "";
            BaseLayer = dto.BaseLayer ?? "osm";
            Target = dto.Target;
            Changed?.Invoke();
        }
        catch (Exception ex) when (ex is JSException or JsonException) { /* ignore corrupt or unavailable storage */ }
    }

    sealed record Saved(
        Sighting? A, Sighting? B, double Declination, double CompassSigma,
        string? ThunderforestKey, string? BaseLayer, Slot? Target);
}
