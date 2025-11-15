using Domain.Neighborhoods;
using MediatR;

namespace Application.Neighborhoods;

public sealed record NeighborhoodGetAllQuery() : IRequest<IQueryable<NeighborhoodDto>>;

public sealed class NeighborhoodDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
}
internal sealed class NeighborhoodGetAllQueryHandler(
    INeighborhoodRepository neighborhoodRepository,
    ICityRepostiory cityRepostiory,
    IDistrictRepostiory districtRepostiory
    ) : IRequestHandler<NeighborhoodGetAllQuery, IQueryable<NeighborhoodDto>>
{
    public Task<IQueryable<NeighborhoodDto>> Handle(NeighborhoodGetAllQuery request, CancellationToken cancellationToken)
    {
        var query = from n in neighborhoodRepository.GetAll()
                    join d in districtRepostiory.GetAll() on n.DistrictId equals d.Id
                    join c in cityRepostiory.GetAll() on d.CityId equals c.Id
                    select new NeighborhoodDto
                    {
                        Id = n.Id,
                        Name = n.Name + ", " + d.Name + ", " + c.Name
                    };
        return Task.FromResult(query);
    }
}