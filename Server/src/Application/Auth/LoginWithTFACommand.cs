using Application.Services;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TS.Result;

namespace Application.Auth;

public sealed record LoginWithTFACommand(string EmailOrUserName,
    string TFACode, bool RememberDevice) : IRequest<Result<LoginCommandResponse>>;

internal sealed class LoginWithTFACommandHandler(
    UserManager<AppUser> userManager,
    IJwtProvider jwtProvider
    )
    : IRequestHandler<LoginWithTFACommand, Result<LoginCommandResponse>>
{
    public async Task<Result<LoginCommandResponse>> Handle(LoginWithTFACommand request, CancellationToken cancellationToken)
    {
        AppUser? user = await userManager.Users.FirstOrDefaultAsync(p => p.Email == request.EmailOrUserName || p.UserName == request.EmailOrUserName);

        if (user is null)
        {
            return Result<LoginCommandResponse>.Failure("İki adımlı doğrulama oturumu bulunamadı. Lütfen yeniden giriş yapın.");
        }

        bool result = await userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider, request.TFACode);

        if (!result)
            return Result<LoginCommandResponse>.Failure("Doğrulama kodu geçersiz veya süresi dolmuş.");

        await userManager.ResetAccessFailedCountAsync(user);

        string token = await jwtProvider.CreateTokenAsync(user, cancellationToken);

        if (token != null) user.TwoFactorEnabled = false;

        LoginCommandResponse loginCommandResponse = new()
        {
            Token = token,
        };

        return loginCommandResponse;
    }
}