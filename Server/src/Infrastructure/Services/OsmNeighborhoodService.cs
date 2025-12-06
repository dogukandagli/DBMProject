using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using Domain.Neighborhoods;
using Application.Services;

namespace Infrastructure.Services
{
    public class OsmNeighborhoodService : IOsmNeighborhoodService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<OsmNeighborhoodService> _logger;
        private readonly ApplicationDbContext _db;

        public OsmNeighborhoodService(
            IHttpClientFactory httpClientFactory,
            ILogger<OsmNeighborhoodService> logger,
            ApplicationDbContext db)
        {
            _httpClient = httpClientFactory.CreateClient("osm");
            _logger = logger;
            _db = db;
        }

        public Task ImportDistrictsAsync(
            string cityName,
            int cityCode,
            CancellationToken cancellationToken = default)
            => ImportDistrictsInternalAsync(cityName, cityCode, cancellationToken);

        public Task ImportNeighborhoodsAsync(
            string cityName,
            int cityCode,
            CancellationToken cancellationToken = default)
            => ImportNeighborhoodsInternalAsync(cityName, cityCode, cancellationToken);
        private async Task<int> EnsureCityAsync(string cityName, CancellationToken cancellationToken)
        {
            var citySet = _db.Set<City>();

            var city = await citySet
                .FirstOrDefaultAsync(c => c.Name == cityName, cancellationToken);

            if (city != null)
                return city.Id;

            _logger.LogWarning("City '{CityName}' bulunamadı, otomatik oluşturuluyor...", cityName);
            var cityEntity = (City)Activator.CreateInstance(typeof(City), nonPublic: true)!;
            cityEntity.SetName(cityName);

            await citySet.AddAsync(cityEntity, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("City oluşturuldu: Id={Id}, Name={Name}",
                cityEntity.Id, cityEntity.Name);

            return cityEntity.Id;
        }
        private async Task ImportDistrictsInternalAsync(
            string cityName,
            int cityCode,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("=== ImportDistrictsAsync START === City={CityName}", cityName);

            int cityId = await EnsureCityAsync(cityName, cancellationToken);

            // İl alanı (admin_level=4) ve sadece ilçeler (admin_level=6)
            var query = $@"
[out:json][timeout:50];

// Şehir alanı (il)
area
  [""name""=""{cityName}""]
  [""boundary""=""administrative""]
  [""admin_level""=""4""]
  ->.city;

// Sadece ilçeler
(
  relation[""boundary""=""administrative""][""admin_level""=""6""](area.city);
);

out tags;
";

            var content = new StringContent(query, Encoding.UTF8, "application/x-www-form-urlencoded");
            var response = await _httpClient.PostAsync("https://overpass-api.de/api/interpreter", content, cancellationToken);

            _logger.LogInformation("District Overpass status: {Status}", response.StatusCode);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogInformation("District JSON length: {Len}", json.Length);

            var osmData = JsonSerializer.Deserialize<OsmResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (osmData?.Elements == null || osmData.Elements.Count == 0)
            {
                _logger.LogWarning("OSM '{City}' için district dönmedi.", cityName);
                return;
            }

            var districtSet = _db.Set<District>();

            var existingNorms = await districtSet
                .Where(d => d.CityId == cityId)
                .Select(d => NormalizeName(d.Name))
                .ToListAsync(cancellationToken);

            var existingSet = new HashSet<string>(existingNorms);
            var newDistricts = new List<District>();

            foreach (var e in osmData.Elements)
            {
                if (e.Tags == null ||
                    !e.Tags.TryGetValue("name", out var name) ||
                    string.IsNullOrWhiteSpace(name))
                    continue;
                if (!e.Tags.TryGetValue("admin_level", out var level) || level != "6")
                    continue;
                if (e.Tags.TryGetValue("place", out var placeVal))
                {
                    var p = placeVal.ToLowerInvariant();
                    if (p == "neighbourhood" || p == "suburb" || p == "quarter" ||
                        p == "village" || p == "hamlet" || p == "isolated_dwelling")
                    {
                        _logger.LogDebug("District filtresi (place): {Name} - {Place}", name, p);
                        continue;
                    }
                }

                if (name.EndsWith("Mahallesi", StringComparison.OrdinalIgnoreCase) ||
                    name.EndsWith(" Mh.", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogDebug("District filtresi (isim): {Name}", name);
                    continue;
                }

                var norm = NormalizeName(name);
                if (existingSet.Contains(norm))
                    continue;

                existingSet.Add(norm);

                var d = new District(0, name, cityId);
                newDistricts.Add(d);
            }

            if (!newDistricts.Any())
            {
                _logger.LogInformation("Yeni district yok.");
                _logger.LogInformation("=== ImportDistrictsAsync END (no-op) ===");
                return;
            }

            await districtSet.AddRangeAsync(newDistricts, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("District insert tamamlandı. Eklenen: {Count}", newDistricts.Count);
            _logger.LogInformation("=== ImportDistrictsAsync END ===");
        }
        private async Task ImportNeighborhoodsInternalAsync(
            string cityName,
            int cityCode,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("=== ImportNeighborhoodsAsync START === City={CityName}", cityName);

            int cityId = await EnsureCityAsync(cityName, cancellationToken);

            var districtSet = _db.Set<District>();
            var districts = await districtSet
                .Where(d => d.CityId == cityId)
                .ToListAsync(cancellationToken);
            if (!districts.Any())
            {
                _logger.LogWarning("District tablosu boş, otomatik ImportDistrictsInternalAsync çağrılıyor...");
                await ImportDistrictsInternalAsync(cityName, cityCode, cancellationToken);

                districts = await districtSet
                    .Where(d => d.CityId == cityId)
                    .ToListAsync(cancellationToken);

                if (!districts.Any())
                {
                    _logger.LogError("District import edildi ama hala boş. City={CityName}", cityName);
                    _logger.LogInformation("=== ImportNeighborhoodsAsync END (no districts) ===");
                    return;
                }
            }

            var neighborhoodSet = _db.Set<Neighborhood>();
            var existingIds = await neighborhoodSet
                .Where(n => n.OsmRelationId != null)
                .Select(n => n.OsmRelationId!.Value)
                .ToListAsync(cancellationToken);

            var existingOsmSet = new HashSet<long>(existingIds);
            var newNeighborhoods = new List<Neighborhood>();
            int debugCounter = 0;

            foreach (var district in districts)
            {
                await Task.Delay(1500, cancellationToken);
                var districtName = district.Name;
                _logger.LogInformation("OSM mahalle importu başlıyor. District={DistrictName}", districtName);
                var query = $@"
[out:json][timeout:50];

// İlçe alanı (admin_level=6)
area
  [""name""=""{districtName}""]
  [""boundary""=""administrative""]
  [""admin_level""=""6""]
  ->.districtArea;

// Bu ilçenin mahalle adayları
(
  relation[""boundary""=""administrative""][""admin_level""=""9""](area.districtArea);

  node[""place""=""neighbourhood""](area.districtArea);
  way[""place""=""neighbourhood""](area.districtArea);
  relation[""place""=""neighbourhood""](area.districtArea);

  node[""place""=""suburb""](area.districtArea);
  way[""place""=""suburb""](area.districtArea);
  relation[""place""=""suburb""](area.districtArea);

  node[""place""=""quarter""](area.districtArea);
  way[""place""=""quarter""](area.districtArea);
  relation[""place""=""quarter""](area.districtArea);
);

out center tags;
";

                var content = new StringContent(query, Encoding.UTF8, "application/x-www-form-urlencoded");
                var response = await _httpClient.PostAsync("https://overpass-api.de/api/interpreter", content, cancellationToken);

                _logger.LogInformation("Neighborhood Overpass status (District={DistrictName}): {Status}", districtName, response.StatusCode);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogInformation("Neighborhood JSON length (District={DistrictName}): {Len}", districtName, json.Length);

                var osmData = JsonSerializer.Deserialize<OsmResponse>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (osmData?.Elements == null || osmData.Elements.Count == 0)
                {
                    _logger.LogWarning("OSM district '{DistrictName}' için mahalle dönmedi.", districtName);
                    continue;
                }

                foreach (var e in osmData.Elements)
                {
                    if (e.Tags == null ||
                        !e.Tags.TryGetValue("name", out var nName) ||
                        string.IsNullOrWhiteSpace(nName))
                        continue;
                    if (debugCounter < 30)
                    {
                        _logger.LogWarning(
                            "DEBUG >>> Mahalle RAW (District={DistrictName}): {Name} | Tags: {Tags}",
                            districtName,
                            nName,
                            string.Join(" | ", e.Tags.Select(kv => $"{kv.Key}={kv.Value}"))
                        );
                        debugCounter++;
                    }
                    if (e.Tags.TryGetValue("admin_level", out var level) && level == "6")
                        continue;
                    if (existingOsmSet.Contains(e.Id))
                        continue;
                    var cleanedName = CleanNeighborhoodName(nName);

                    var coords = GetBestCoords(e);
                    double? lat = coords.lat;
                    double? lon = coords.lon;

                    var n = new Neighborhood(0, cleanedName, district.Id)
                    {
                        Latitude = lat,
                        Longitude = lon,
                        OsmRelationId = e.Id
                    };

                    newNeighborhoods.Add(n);
                    existingOsmSet.Add(e.Id);
                }
            }

            if (!newNeighborhoods.Any())
            {
                _logger.LogInformation("Yeni mahalle yok.");
                _logger.LogInformation("=== ImportNeighborhoodsAsync END (no new neighborhoods) ===");
                return;
            }

            await neighborhoodSet.AddRangeAsync(newNeighborhoods, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Mahalle insert tamamlandı. Eklenen: {Count}", newNeighborhoods.Count);
            _logger.LogInformation("=== ImportNeighborhoodsAsync END ===");
        }
        private static (double? lat, double? lon) GetBestCoords(OsmElement e)
        {
            if (e.Lat.HasValue && e.Lon.HasValue)
                return (e.Lat, e.Lon);

            if (e.Center != null)
                return (e.Center.Lat, e.Center.Lon);

            return (null, null);
        }
        private static string NormalizeName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return string.Empty;
            var cleaned = CleanNeighborhoodName(name);

            return cleaned
                .Trim()
                .Replace("ı", "i").Replace("İ", "I")
                .Replace("ç", "c").Replace("Ç", "C")
                .Replace("ş", "s").Replace("Ş", "S")
                .Replace("ğ", "g").Replace("Ğ", "G")
                .Replace("ö", "o").Replace("Ö", "O")
                .Replace("ü", "u").Replace("Ü", "U")
                .ToUpperInvariant();
        }
        private static string CleanNeighborhoodName(string rawName)
        {
            if (string.IsNullOrWhiteSpace(rawName))
                return rawName;

            var name = rawName.Trim();
            var lower = name.ToLower(new CultureInfo("tr-TR"));

            var suffixes = new[]
            {
                " mahallesi",
                " mah.",
                " mah",
                " mh.",
                " mh"
            };

            foreach (var suffix in suffixes)
            {
                if (lower.EndsWith(suffix))
                {
                    var idx = lower.LastIndexOf(suffix, StringComparison.Ordinal);
                    if (idx >= 0)
                    {
                        name = name.Substring(0, idx);
                        break;
                    }
                }
            }

            return name.Trim().TrimEnd(',', '-', ' ').Trim();
        }

        // DTO
        public class OsmResponse
        {
            public List<OsmElement> Elements { get; set; } = new();
        }

        public class OsmElement
        {
            public long Id { get; set; }
            public double? Lat { get; set; }
            public double? Lon { get; set; }
            public OsmCenter? Center { get; set; }
            public Dictionary<string, string>? Tags { get; set; }
        }

        public class OsmCenter
        {
            public double Lat { get; set; }
            public double Lon { get; set; }
        }
    }
}
