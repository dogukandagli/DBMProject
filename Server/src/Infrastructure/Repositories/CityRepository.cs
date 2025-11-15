using Domain.Neighborhoods;
using GenericRepository;
using Infrastructure.Context;

namespace Infrastructure.Repositories;

internal class CityRepository : Repository<City, ApplicationDbContext>, ICityRepostiory
{
    public CityRepository(ApplicationDbContext context) : base(context)
    {
    }
}
