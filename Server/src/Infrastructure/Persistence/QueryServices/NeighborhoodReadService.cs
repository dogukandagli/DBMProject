using Application.Locations.Interfaces;
using Domain.Neighborhoods;
using Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.QueryServices;

internal class NeighborhoodReadService(ApplicationDbContext context) : INeighborhoodReadService
{

    public Task<Neighborhood?> GetNeighborhoodAsync(
        string city,
        string district,
        string neighborhood,
        CancellationToken cancellationToken = default)
    {
        var cities = context.City;
        var districts = context.District;
        var neighborhoods = context.Neighborhood;

        var query =
            from n in neighborhoods
            join d in districts on n.DistrictId equals d.Id
            join c in cities on d.CityId equals c.Id
            where c.Name == city
                && d.Name == district
                && n.Name == neighborhood
            select n;

        return query.FirstOrDefaultAsync(cancellationToken);
    }
}