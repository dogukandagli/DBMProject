using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TS.Result;

namespace Application.Auth;

public sealed record LoginWithTFACommand(
    string EmailOrUserName,
    string TFACode) : IRequest<Result<LoginCommandResponse>>;

internal sealed class LoginWithTFACommandHandler(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager)
    : IRequestHandler<LoginWithTFACommand, Result<LoginCommandResponse>>
{
    public async Task<Result<LoginCommandResponse>> Handle(LoginWithTFACommand request, CancellationToken cancellationToken)
    {
        AppUser? user = await userManager.Users.FirstOrDefaultAsync(
            p => p.Email == request.EmailOrUserName
            || p.UserName == request.EmailOrUserName);

        if (user is null)
        {
            return Result<LoginCommandResponse>.Failure("Kullanıcı adı ya da şifre yanlış");
        }

        if (!await userManager.GetTwoFactorEnabledAsync(user))
        {
            return Result<LoginCommandResponse>.Failure("Bu hesapta iki adımlı doğrulama etkin değil.");
        }


        SignInResult signInResult = await signInManager.TwoFactorSignInAsync(TokenOptions.DefaultEmailProvider, request.TFACode, false, false);

        if (!signInResult.Succeeded)
            return Result<LoginCommandResponse>.Failure("Doğrulama kodu geçersiz veya süresi dolmuş.");

        await userManager.ResetAccessFailedCountAsync(user);
        //token uret token i geri gonder 

        LoginCommandResponse loginCommandResponse = new()
        {
            Token = "TFacode uretildi" + request.TFACode,
        };

        return loginCommandResponse;

    }
}