using Domain.Neighborhoods;

namespace Application.Queries;

public interface INeighborhoodQueryService
{
    Task<Neighborhood?> GetNeighborhoodAsync(
        string city,
        string district,
        string neighborhood,
        CancellationToken cancellationToken = default);
}
