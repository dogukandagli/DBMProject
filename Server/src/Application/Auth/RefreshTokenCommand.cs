using Application.Services;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record RefreshTokenCommand() : IRequest<Result<RefreshTokenCommandResponse>>;

public sealed record RefreshTokenCommandResponse
{
    public string? Token { get; set; }
}

internal sealed class RefreshTokenCommandHandler(
    IJwtProvider jwtProvider,
    UserManager<AppUser> userManager) : IRequestHandler<RefreshTokenCommand, Result<RefreshTokenCommandResponse>>
{
    public async Task<Result<RefreshTokenCommandResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var (ok, userId) = await jwtProvider.ValidateRefreshToken(cancellationToken);
        RefreshTokenCommandResponse refreshTokenCommandResponse = new RefreshTokenCommandResponse();

        if (!ok || userId is null)
        {
            refreshTokenCommandResponse.Token = null;
            return refreshTokenCommandResponse;
        }

        AppUser? user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            refreshTokenCommandResponse.Token = null;
            return refreshTokenCommandResponse;
        }

        string accessToken = await jwtProvider.CreateTokenAsync(user, cancellationToken);
        string refreshToken = await jwtProvider.CreateRefreshTokenAsync(user, cancellationToken);
        refreshTokenCommandResponse.Token = accessToken;

        return refreshTokenCommandResponse;
    }
}