using Application.Common.Models;
using TS.Result;

namespace Application.Services;

public interface IMapsService
{
    Task<Result<AddressDto>> GetAddressFromCoordinatesAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken = default);
}
