using Application.Services;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TS.Result;

namespace Application.Auth;

public sealed record LoginWithTFACommand(string EmailOrUserName,
    string TFACode, bool RememberDevice) : IRequest<Result<LoginWithTFACommandResponse>>;


public sealed record LoginWithTFACommandResponse
{
    public string? Token { get; set; }
}

internal sealed class LoginWithTFACommandHandler(
    UserManager<AppUser> userManager,
    IJwtProvider jwtProvider
    )
    : IRequestHandler<LoginWithTFACommand, Result<LoginWithTFACommandResponse>>
{
    public async Task<Result<LoginWithTFACommandResponse>> Handle(LoginWithTFACommand request, CancellationToken cancellationToken)
    {
        AppUser? user = await userManager.Users.FirstOrDefaultAsync(p => p.Email == request.EmailOrUserName || p.UserName == request.EmailOrUserName);

        if (user is null)
        {
            return Result<LoginWithTFACommandResponse>.Failure("İki adımlı doğrulama oturumu bulunamadı. Lütfen yeniden giriş yapın.");
        }

        bool result = await userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider, request.TFACode);

        if (!result)
            return Result<LoginWithTFACommandResponse>.Failure("Doğrulama kodu geçersiz veya süresi dolmuş.");

        await userManager.ResetAccessFailedCountAsync(user);

        user.TwoFactorEnabled = false;
        await userManager.UpdateAsync(user);

        string token = await jwtProvider.CreateTokenAsync(user, cancellationToken);

        if (token != null) user.TwoFactorEnabled = false;

        LoginWithTFACommandResponse loginWithTFACommandResponse = new()
        {
            Token = token,
        };

        return loginWithTFACommandResponse;
    }
}