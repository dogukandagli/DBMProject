using Domain.Neighborhoods;

namespace Application.Locations.Interfaces;

public interface INeighborhoodReadService
{
    Task<Neighborhood?> GetNeighborhoodAsync(
        string city,
        string district,
        string neighborhood,
        CancellationToken cancellationToken = default);
}
