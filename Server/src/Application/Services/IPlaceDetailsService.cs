using Application.Common.Models;

namespace Application.Services;

public interface IPlaceDetailsService
{
    Task<AddressDto> GetPlaceDetailsAsync(string placeId, string sessionToken, CancellationToken cancellationToken = default);
}
