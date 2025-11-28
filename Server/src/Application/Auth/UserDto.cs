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
    public string LocationText { get; set; } = default!;

}
public static class UserDtoExtensions
{
    public static Task<UserDto?> MapToUserDto(
       this IQueryable<AppUser> users,
        IQueryable<Neighborhood> neighborhoods,
        IQueryable<District> districts,
        IQueryable<City> cities,
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
                        LocationText = $"{n.Name}, {d.Name}, {c.Name}",
                        PhotoUrl = u.PhotoUrl
                    };

        return query.FirstOrDefaultAsync(cancellationToken);
    }
}
