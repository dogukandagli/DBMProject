using Domain.Users;

namespace Application.Services;

public interface IJwtProvider
{
    Task<string> CreateTokenAsync(AppUser appUser, CancellationToken cancellationToken = default);
}
