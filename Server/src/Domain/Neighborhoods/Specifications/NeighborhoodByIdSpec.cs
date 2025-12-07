using Ardalis.Specification;

namespace Domain.Neighborhoods.Specifications;

public sealed class NeighborhoodByIdSpec : Specification<Neighborhood>
{
    public NeighborhoodByIdSpec(int id)
    {
        Query.Where(n => n.Id == id);
    }
}
