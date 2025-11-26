using Application.Common.Models;
using Application.Services;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using System.Text.Json.Nodes;


namespace Infrastructure.Services;

public class GoogleAutoCompleteService(
    IHttpClientFactory httpClientFactory,
    IOptions<AppSettingOptions> appSettingOptions
    ) : IAutoCompleteService
{
    public async Task<List<AutocompleteResult>> GetAutocompletePredictionsAsync(string query, string sessionToken, CancellationToken cancellationToken = default)
    {
        string apiKey = appSettingOptions.Value.GoogleMapsApiKey;

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new ArgumentException("Api Key bilgisi eksik.");
        }
        var sessionParam = string.IsNullOrWhiteSpace(sessionToken) ? "" : $"&sessiontoken={sessionToken}";

        var url = $"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={query}&key={apiKey}&language=tr{sessionParam}";

        var client = httpClientFactory.CreateClient("GoogleMaps");

        var response = await client.GetAsync(url, cancellationToken);

        response.EnsureSuccessStatusCode();

        var jsonString = await response.Content.ReadAsStringAsync(cancellationToken);

        var jsonNode = JsonNode.Parse(jsonString);

        var resultList = new List<AutocompleteResult>();

        var predictions = jsonNode?["predictions"]?.AsArray();

        if (predictions is not null)
        {
            foreach (var item in predictions)
            {
                string description = item?["description"]?.GetValue<string>() ?? "";
                string placeId = item?["place_id"]?.GetValue<string>() ?? "";

                string mainText = item?["structured_formatting"]?["main_text"]?.GetValue<string>() ?? "";
                string secondaryText = item?["structured_formatting"]?["secondary_text"]?.GetValue<string>() ?? "";

                var typesList = new List<string>();
                var typesArray = item?["types"]?.AsArray();

                if (typesArray is not null)
                {
                    foreach (var t in typesArray)
                    {
                        var typeVal = t?.GetValue<string>();
                        if (!string.IsNullOrEmpty(typeVal))
                        {
                            typesList.Add(typeVal);
                        }
                    }
                }

                // 4. Listeye Ekle
                resultList.Add(new AutocompleteResult
                {
                    Description = description,
                    PlaceId = placeId,
                    MainText = mainText,
                    SecondaryText = secondaryText,
                    Types = typesList
                });
            }
        }
        return resultList;

    }
}
