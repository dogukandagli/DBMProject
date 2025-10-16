using Domain.Users;

namespace Application.Services;

public interface IJwtProvider
{
    Task<string> CreateTokenAsync(AppUser appUser, CancellationToken cancellationToken = default);
    Task<string> CreateRefreshTokenAsync(AppUser appUser, CancellationToken cancellationToken = default);
    Task<(bool Ok, string? UserId)> ValidateRefreshToken(CancellationToken cancellationToken = default);
}
