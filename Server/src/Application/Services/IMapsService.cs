using Application.Common.Models;

namespace Application.Services;

public interface IMapsService
{
    Task<AddressDto> GetAddressFromCoordinatesAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken = default);
}
