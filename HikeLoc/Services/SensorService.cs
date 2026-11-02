using HikeLoc.Core;
using Microsoft.JSInterop;

namespace HikeLoc.Services;

public sealed record HeadingSample(double Mean, double StdDev, int Count);

/// <summary>
/// Bridges the browser's Geolocation and compass APIs (via js/hikeloc.js) into .NET.
/// The JS side pushes a reading about five times a second.
/// </summary>
public sealed class SensorService : IAsyncDisposable
{
    readonly IJSRuntime _js;
    IJSObjectReference? _module;
    DotNetObjectReference<SensorService>? _self;

    public SensorService(IJSRuntime js) => _js = js;

    public bool Running { get; private set; }
    public string? Error { get; private set; }

    /// <summary>Magnetic compass heading of the phone's pointing direction, degrees, smoothed.</summary>
    public double? Heading { get; private set; }
    public double? Lat { get; private set; }
    public double? Lon { get; private set; }
    public double? AccuracyM { get; private set; }

    public LatLon? Position => Lat is { } la && Lon is { } lo ? new LatLon(la, lo) : null;

    public event Action? Changed;

    /// <summary>Loads the JS module early so the later Start call stays inside the tap's user-gesture window (needed on iOS).</summary>
    public async Task PreloadAsync() => _module ??= await _js.InvokeAsync<IJSObjectReference>("import", "./js/hikeloc.js");

    public async Task StartAsync()
    {
        if (Running) return;
        await PreloadAsync();
        _self ??= DotNetObjectReference.Create(this);
        Error = await _module!.InvokeAsync<string?>("start", _self);
        Running = true;
        Changed?.Invoke();
    }

    public async Task StopAsync()
    {
        if (_module is null || !Running) return;
        await _module.InvokeVoidAsync("stop");
        Running = false;
        Heading = null;
        Changed?.Invoke();
    }

    /// <summary>Circular mean and spread of the compass over the last <paramref name="windowMs"/> milliseconds.</summary>
    public async Task<HeadingSample?> SampleHeadingAsync(int windowMs = 1500) =>
        _module is null ? null : await _module.InvokeAsync<HeadingSample?>("sampleHeading", windowMs);

    public IJSObjectReference? Module => _module;

    [JSInvokable]
    public void OnReading(double? heading, double? lat, double? lon, double? accuracyM, string? error)
    {
        Heading = heading;
        Lat = lat;
        Lon = lon;
        AccuracyM = accuracyM;
        Error = error;
        Changed?.Invoke();
    }

    public async ValueTask DisposeAsync()
    {
        if (_module is not null)
        {
            try { await _module.InvokeVoidAsync("stop"); await _module.DisposeAsync(); } catch (JSDisconnectedException) { }
        }
        _self?.Dispose();
    }
}
