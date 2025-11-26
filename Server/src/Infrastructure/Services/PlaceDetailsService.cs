using Application.Common.Models;
using Application.Services;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using System.Text.Json.Nodes;

namespace Infrastructure.Services;

public class PlaceDetailsService(
    IHttpClientFactory httpClientFactory,
    IOptions<AppSettingOptions> appSettingOptions) : IPlaceDetailsService
{


    public async Task<AddressDto> GetPlaceDetailsAsync(string placeId, string sessionToken, CancellationToken cancellationToken = default)
    {
        var apiKey = appSettingOptions.Value.GoogleMapsApiKey;
        if (string.IsNullOrWhiteSpace(apiKey)) throw new ArgumentException("Api Key eksik.");

        var sessionParam = string.IsNullOrWhiteSpace(sessionToken) ? "" : $"&sessiontoken={sessionToken}";

        var fields = "place_id,name,formatted_address,address_components,geometry";
        var url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&fields={fields}&key={apiKey}&language=tr{sessionParam}";

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

        var result = jsonNode?["result"];
        if (result is null)
        {
            throw new ArgumentException("Google API yanıtında sonuç bulunamadı.");
        }

        string name = result["name"]?.GetValue<string>() ?? "";
        string formattedAddress = result["formatted_address"]?.GetValue<string>() ?? "";
        string placeIdResult = result["place_id"]?.GetValue<string>() ?? "";

        var locationNode = result["geometry"]?["location"];
        double lat = locationNode?["lat"]?.GetValue<double>() ?? 0;
        double lng = locationNode?["lng"]?.GetValue<double>() ?? 0;

        string? street = null;
        string? neighborhood = null;
        string? district = null;
        string? city = null;
        string? postalCode = null;
        string? country = null;

        var addressComponents = result["address_components"]?.AsArray();

        if (addressComponents is not null)
        {
            foreach (var component in addressComponents)
            {
                // Uzun ismi al (Örn: "Kadıköy")
                string longName = component?["long_name"]?.GetValue<string>() ?? "";
                string shortName = component?["short_name"]?.GetValue<string>() ?? "";

                // Tipleri kontrol et
                var typesArray = component?["types"]?.AsArray();

                if (typesArray is not null)
                {
                    // O bileşenin tüm tiplerini gez (Google bazen birden fazla tip döner)
                    foreach (var t in typesArray)
                    {
                        var typeName = t?.GetValue<string>();

                        switch (typeName)
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

                            case "route":
                                street = longName;
                                break;

                            case "postal_code":
                                postalCode = longName;
                                break;
                            case "country":
                                country = longName;
                                break;
                        }
                    }
                }
            }
        }

        AddressDto addressDto = new AddressDto()
        {
            City = city,
            District = district,
            Neighborhood = neighborhood,
            Street = street,
            PostalCode = postalCode,
            FormattedAddress = formattedAddress,
            Latitude = lat,
            Longitude = lng,
            PlaceId = placeId,
            Country = country
        };
        return addressDto;
    }
}
