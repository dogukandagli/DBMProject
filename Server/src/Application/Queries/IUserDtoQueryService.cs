using Application.Auth;

namespace Application.Queries;

public interface IUserDtoQueryService
{
    Task<UserDto?> GetUserDtoAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}
