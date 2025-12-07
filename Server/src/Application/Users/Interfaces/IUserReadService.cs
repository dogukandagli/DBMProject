using Application.Auth;

namespace Application.Users.Interfaces;

public interface IUserReadService
{
    Task<UserDto?> GetUserDtoAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}
