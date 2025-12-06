using Ardalis.Specification.EntityFrameworkCore;
using Domain.Neighborhoods;
using Infrastructure.Context;

namespace Infrastructure.Repositories;

internal class DistrictRepository : RepositoryBase<District>, IDistrictRepostiory
{
    public DistrictRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
