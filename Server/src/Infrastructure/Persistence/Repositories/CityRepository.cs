using Ardalis.Specification.EntityFrameworkCore;
using Domain.Neighborhoods;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

internal class CityRepository : RepositoryBase<City>, ICityRepostiory
{
    public CityRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}

