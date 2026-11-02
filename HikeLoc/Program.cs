using HikeLoc;
using HikeLoc.Services;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");

builder.Services.AddSingleton<SensorService>();
builder.Services.AddSingleton<AppState>();

await builder.Build().RunAsync();
