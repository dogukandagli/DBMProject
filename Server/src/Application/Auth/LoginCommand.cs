using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TS.Result;

namespace Application.Auth;

public sealed record LoginCommand(
    string EmailOrUserName
    , string Password) : IRequest<Result<LoginCommandResponse>>;

public sealed record LoginCommandResponse
{
    public string? Token { get; set; }
    public string? TFACode { get; set; }
}

internal sealed class LoginCommandHandler(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager) : IRequestHandler<LoginCommand, Result<LoginCommandResponse>>
{
    public async Task<Result<LoginCommandResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {

        AppUser? appUser = await userManager.Users
            .FirstOrDefaultAsync(
            u => u.Email == request.EmailOrUserName || u.UserName == request.EmailOrUserName
            );
        if (appUser is null)
        {
            return Result<LoginCommandResponse>.Failure("Kullanıcı bulunumadı");
        }

        SignInResult signInResult = await signInManager
            .PasswordSignInAsync(appUser, request.Password, false, true);

        if (signInResult.IsLockedOut)
        {
            TimeSpan? timeSpan = appUser.LockoutEnd - DateTime.UtcNow;
            if (timeSpan is not null)
            {
                Result<LoginCommandResponse>.Failure($"Şifrenizi 5 defa yanlış girdiğiniz için kullanıcı " +
                    $"{Math.Ceiling(timeSpan.Value.TotalMinutes)} dakika süreyle bloke edilmiştir");
            }
        }
        if (signInResult.IsNotAllowed)
        {
            var token2 = await userManager.GenerateEmailConfirmationTokenAsync(appUser);
            var result = await userManager.ConfirmEmailAsync(appUser, token2);

            if (result.Succeeded)
            {
                LoginCommandResponse loginCommandResponse2 = new()
                {
                    Token = token2
                };
                return loginCommandResponse2;
            }

            return Result<LoginCommandResponse>.Failure("Mail adresiniz onayli değil");
        }

        if (signInResult.RequiresTwoFactor)
        {
            var token = await userManager.GenerateTwoFactorTokenAsync(appUser, TokenOptions.DefaultEmailProvider);

            LoginCommandResponse loginCommandResponse2 = new()
            {
                TFACode = token,
            };
            return loginCommandResponse2;
        }

        if (!signInResult.Succeeded)
        {
            return Result<LoginCommandResponse>.Failure("Şifreniz yanlış");
        }
        LoginCommandResponse loginCommandResponse = new()
        {
            Token = "token kod"
        };

        return loginCommandResponse;

    }
}