using Application.Common.Models;
using Application.Services;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Text.Json.Nodes;

namespace Infrastructure.Services;

public class GoogleMapsService(
    IHttpClientFactory httpClientFactory,
    IOptions<AppSettingOptions> appSettingOptions
    ) : IMapsService
{
    public async Task<AddressDto> GetAddressFromCoordinatesAsync(double latitude, double longitude, CancellationToken cancellationToken = default)
    {
        string? streetNumber = null;
        string? route = null;
        string? neighborhood = null;
        string? district = null;
        string? city = null;
        string? postalCode = null;
        string? country = null;


        string apiKey = appSettingOptions.Value.GoogleMapsApiKey;
        string lat = latitude.ToString(CultureInfo.InvariantCulture);
        string lng = longitude.ToString(CultureInfo.InvariantCulture);

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new ArgumentException($"Api Key bilgisi eksik.");
        }

        var url = $"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={apiKey}&language=tr";


        var client = httpClientFactory.CreateClient("GoogleMaps");

        var response = await client.GetAsync(url, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new ArgumentException($"Google API hatası: {response.StatusCode}");
        }

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        var jsonNode = JsonNode.Parse(content);

        var status = jsonNode?["status"]?.GetValue<string>();
        if (status != "OK")
        {
            throw new ArgumentException($"Google API hatası: {status}");

        }

        var results = jsonNode?["results"]?.AsArray();
        if (results is null || results.Count == 0)
        {
            throw new ArgumentException("Sonuç bulunamadı.");
        }

        string? formatted = results[0]?["formatted_address"]?.GetValue<string>();
        string? placeId = results[0]?["place_id"]?.GetValue<string>();


        var locationNode = results[0]?["geometry"]?["location"];

        double lati = locationNode?["lat"]?.GetValue<double>() ?? 0;
        double longi = locationNode?["lng"]?.GetValue<double>() ?? 0;

        var components = results[0]?["address_components"]?.AsArray();
        if (components is null)
        {
            throw new ArgumentException("Adres bileşenleri bulunamadı.");
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

                case "street_number":
                    streetNumber = longName;
                    break;

                case "route":
                    route = longName;
                    break;


                case "postal_code":
                    postalCode = longName;
                    break;
                case "country":
                    country = longName;
                    break;



            }
        }

        AddressDto addressDto = new AddressDto()
        {
            City = city,
            District = district,
            Neighborhood = neighborhood,
            Street = route,
            BuildingNo = streetNumber,
            PostalCode = postalCode,
            FormattedAddress = formatted,
            Latitude = lati,
            Longitude = longi,
            PlaceId = placeId,
            Country = country
        };
        return addressDto;
    }


}
