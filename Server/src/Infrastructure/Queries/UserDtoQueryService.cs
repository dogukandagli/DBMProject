using Application.Auth;
using Application.Queries;
using Domain.Users;
using Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Queries;

internal class UserDtoQueryService(
    UserManager<AppUser> userManager,
    ApplicationDbContext context) : IUserDtoQueryService
{
    public Task<UserDto?> GetUserDtoAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var users = userManager.Users;
        var neighborhoods = context.Neighborhood;
        var districts = context.District;
        var cities = context.City;

        var query =
            from u in users
            join n in neighborhoods on u.NeighborhoodId equals n.Id
            join d in districts on n.DistrictId equals d.Id
            join c in cities on d.CityId equals c.Id
            where u.Id == userId
            select new UserDto
            {
                Id = u.Id,
                Email = u.Email!,
                FirstName = u.FirstName.Value,
                LastName = u.LastName.Value,
                FullName = $"{u.FirstName.Value} {u.LastName.Value}",
                IsLocationVerified = u.IsLocationVerified,
                NeighborhoodId = u.NeighborhoodId,
                LocationText = u.FormattedAddress,
                ProfilePhotoUrl = u.ProfilePhotoUrl,
                CoverPhotoUrl = u.CoverPhotoUrl,
                City = c.Name,
                District = d.Name,
                Neighborhood = n.Name,
                Biography = u.Biography,
            };

        return query.FirstOrDefaultAsync(cancellationToken);
    }
}
