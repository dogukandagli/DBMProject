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
        if (!ok || userId is null)
        {
            return Result<LoginCommandResponse>.Failure("Yetkiniz Yok");
        }

        AppUser? user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return Result<LoginCommandResponse>.Failure("Kullanici Yok");
        }

        string accessToken = await jwtProvider.CreateTokenAsync(user, cancellationToken);
        string refreshToken = await jwtProvider.CreateRefreshTokenAsync(user, cancellationToken);
        LoginCommandResponse response = new()
        {
            Token = accessToken,
        };

        return response;
    }
}