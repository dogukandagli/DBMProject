using Application.Services;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record RefreshTokenCommand() : IRequest<Result<LoginCommandResponse>>;

internal sealed class RefreshTokenCommandHandler(
    IJwtProvider jwtProvider,
    UserManager<AppUser> userManager) : IRequestHandler<RefreshTokenCommand, Result<LoginCommandResponse>>
{
    public async Task<Result<LoginCommandResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var (ok, userId) = await jwtProvider.ValidateRefreshToken(cancellationToken);
        LoginCommandResponse loginCommandResponse = new LoginCommandResponse();

        if (!ok || userId is null)
        {
            loginCommandResponse.Token = null;
            return loginCommandResponse;
        }

        AppUser? user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            loginCommandResponse.Token = null;
            return loginCommandResponse;
        }

        string accessToken = await jwtProvider.CreateTokenAsync(user, cancellationToken);
        string refreshToken = await jwtProvider.CreateRefreshTokenAsync(user, cancellationToken);
        loginCommandResponse.Token = accessToken;

        return loginCommandResponse;
    }
}