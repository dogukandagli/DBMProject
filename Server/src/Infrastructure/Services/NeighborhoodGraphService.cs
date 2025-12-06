using Application.Services;
using Domain.Neighborhoods;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public sealed class NeighborhoodGraphService : INeighborhoodGraphService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<NeighborhoodGraphService> _logger;

        // İki mahalle arasındaki max mesafe istersen değiştir
        private const double MaxDistanceKm = 1.5;

        public NeighborhoodGraphService(
            ApplicationDbContext db,
            ILogger<NeighborhoodGraphService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task GenerateGraphForCityAsync(int cityId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("=== GenerateGraphForCityAsync START === (CityId={CityId})", cityId);
            var neighborhoods = await _db.Set<Neighborhood>()
                .Where(n => n.Latitude != null && n.Longitude != null)
                .Select(n => new
                {
                    n.Id,
                    n.Latitude,
                    n.Longitude
                })
                .ToListAsync(cancellationToken);

            if (!neighborhoods.Any())
            {
                _logger.LogWarning("Koordinatı olan mahalle bulunamadı, graph oluşturulamadı.");
                return;
            }

            _logger.LogInformation("Graph için {Count} mahalle bulundu (cityId şimdilik dikkate alınmıyor).",
                neighborhoods.Count);
            var oldEdges = await _db.Set<NeighborhoodEdge>()
                .ToListAsync(cancellationToken);

            if (oldEdges.Any())
            {
                _logger.LogInformation("{Count} eski NeighborhoodEdge siliniyor...", oldEdges.Count);
                _db.Set<NeighborhoodEdge>().RemoveRange(oldEdges);
                await _db.SaveChangesAsync(cancellationToken);
            }
            var newEdges = new List<NeighborhoodEdge>();

            for (int i = 0; i < neighborhoods.Count; i++)
            {
                var a = neighborhoods[i];
                double latA = a.Latitude!.Value;
                double lonA = a.Longitude!.Value;

                for (int j = i + 1; j < neighborhoods.Count; j++)
                {
                    var b = neighborhoods[j];
                    double latB = b.Latitude!.Value;
                    double lonB = b.Longitude!.Value;

                    double distanceKm = HaversineDistanceKm(latA, lonA, latB, lonB);

                    if (distanceKm <= MaxDistanceKm)
                    {
                        var edge = new NeighborhoodEdge(
                            fromId: a.Id,
                            toId: b.Id,
                            distanceKm: distanceKm,
                            isBidirectional: true
                        );

                        newEdges.Add(edge);
                    }
                }
            }

            if (!newEdges.Any())
            {
                _logger.LogInformation("Oluşturulacak yeni edge yok (yakın mahalle bulunamadı).");
                _logger.LogInformation("=== GenerateGraphForCityAsync END (no edges) ===");
                return;
            }
            await _db.Set<NeighborhoodEdge>().AddRangeAsync(newEdges, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("{EdgeCount} adet NeighborhoodEdge oluşturuldu.", newEdges.Count);
            _logger.LogInformation("=== GenerateGraphForCityAsync END ===");
        }
        private static double HaversineDistanceKm(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371.0; 

            double dLat = ToRadians(lat2 - lat1);
            double dLon = ToRadians(lon2 - lon1);

            double a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c;
        }

        private static double ToRadians(double deg) => deg * (Math.PI / 180.0);
    }
}
