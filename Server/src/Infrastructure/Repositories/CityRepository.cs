using Ardalis.Specification.EntityFrameworkCore;
using Domain.Neighborhoods;
using Infrastructure.Context;

namespace Infrastructure.Repositories;

internal class CityRepository : RepositoryBase<City>, ICityRepostiory
{
    public CityRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}

