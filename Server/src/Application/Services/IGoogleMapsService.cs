using TS.Result;

namespace Application.Services;

public interface IGoogleMapsService
{
    Task<Result<(string City, string District, string Neighborhood)>> GetAddressFromCoordinatesAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken = default);
}
