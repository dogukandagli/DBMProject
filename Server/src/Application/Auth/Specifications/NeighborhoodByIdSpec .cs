using Ardalis.Specification;
using Domain.Neighborhoods;

namespace Application.Auth.Specifications;

public sealed class NeighborhoodByIdSpec : Specification<Neighborhood>
{
    public NeighborhoodByIdSpec(int id)
    {
        Query.Where(n => n.Id == id);
    }
}
