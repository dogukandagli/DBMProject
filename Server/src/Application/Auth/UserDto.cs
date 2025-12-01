using Domain.Neighborhoods;
using Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Application.Auth;

public sealed class UserDto
{
    public Guid Id { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string? PhotoUrl { get; set; } = default!;
    public bool IsLocationVerified { get; set; }
    public int NeighborhoodId { get; set; }
    public string City { get; set; } = default!;
    public string District { get; set; } = default!;
    public string Neighborhood { get; set; } = default!;
    public string LocationText { get; set; } = default!;

}
public static class UserDtoExtensions
{
    public static Task<UserDto?> MapToUserDto(
       this IQueryable<AppUser> users,
       IQueryable<City> cities,
       IQueryable<District> districts,
       IQueryable<Neighborhood> neighborhoods,
        Guid userId,
        CancellationToken cancellationToken
        )
    {

        var query = from u in users
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
                        PhotoUrl = u.PhotoUrl,
                        City = c.Name,
                        District = d.Name,
                        Neighborhood = n.Name
                    };

        return query.FirstOrDefaultAsync(cancellationToken);
    }
}
