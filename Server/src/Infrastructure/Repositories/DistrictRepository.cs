using Domain.Neighborhoods;
using GenericRepository;
using Infrastructure.Context;

namespace Infrastructure.Repositories;

internal class DistrictRepository : Repository<District, ApplicationDbContext>, IDistrictRepostiory
{
    public DistrictRepository(ApplicationDbContext context) : base(context)
    {
    }
}
