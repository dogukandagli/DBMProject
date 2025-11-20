using Application.Services;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Text.Json.Nodes;
using TS.Result;

namespace Infrastructure.Services;

public class GoogleMapsService(
    IHttpClientFactory httpClientFactory,
    IOptions<AppSettingOptions> appSettingOptions
    ) : IGoogleMapsService
{
    public async Task<Result<(string City, string District, string Neighborhood)>> GetAddressFromCoordinatesAsync(double latitude, double longitude, CancellationToken cancellationToken = default)
    {
        string? city = null;
        string? district = null;
        string? neighborhood = null;

        string apiKey = appSettingOptions.Value.GoogleMapsApiKey;
        string lat = latitude.ToString(CultureInfo.InvariantCulture);
        string lng = longitude.ToString(CultureInfo.InvariantCulture);

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return Result<(string, string, string)>.Failure($"Api Key bilgisi eksik.");
        }

        var url = $"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={apiKey}&language=tr";


        var client = httpClientFactory.CreateClient("GoogleMaps");

        var response = await client.GetAsync(url, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return Result<(string, string, string)>.Failure($"Google API hatası: {response.StatusCode}");
        }

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        var jsonNode = JsonNode.Parse(content);

        var status = jsonNode?["status"]?.GetValue<string>();
        if (status != "OK")
        {
            return Result<(string, string, string)>.Failure($"Google API hatası: {status}");
        }

        var results = jsonNode?["results"]?.AsArray();
        if (results is null || results.Count == 0)
        {
            return Result<(string, string, string)>.Failure("Sonuç bulunamadı.");
        }

        var components = results[0]?["address_components"]?.AsArray();
        if (components is null)
        {
            return Result<(string, string, string)>.Failure("Adres bileşenleri bulunamadı.");
        }

        foreach (var component in components)
        {
            var types = component?["types"]?.AsArray();
            if (types is null || types.Count == 0)
                continue;

            var type = types[0]?.GetValue<string>();
            var longName = component?["long_name"]?.GetValue<string>();

            switch (type)
            {
                case "administrative_area_level_4":
                    neighborhood = longName;
                    break;

                case "administrative_area_level_2":
                    if (district is null)
                        district = longName;
                    break;

                case "administrative_area_level_1":
                    city = longName;
                    break;
            }
        }

        if (city is null || district is null || neighborhood is null)
        {
            return Result<(string, string, string)>.Failure("İl, İlçe veya Mahalle bilgisi eksik.");
        }

        return (city!, district!, neighborhood!);
    }
}
