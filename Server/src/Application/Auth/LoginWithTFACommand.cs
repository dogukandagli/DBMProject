using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record LoginWithTFACommand(
    string TFACode, bool RememberDevice) : IRequest<Result<LoginCommandResponse>>;

internal sealed class LoginWithTFACommandHandler(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager)
    : IRequestHandler<LoginWithTFACommand, Result<LoginCommandResponse>>
{
    public async Task<Result<LoginCommandResponse>> Handle(LoginWithTFACommand request, CancellationToken cancellationToken)
    {
        AppUser? user = await signInManager.GetTwoFactorAuthenticationUserAsync();

        if (user is null)
        {
            return Result<LoginCommandResponse>.Failure("İki adımlı doğrulama oturumu bulunamadı. Lütfen yeniden giriş yapın.");
        }

        SignInResult signInResult = await signInManager.TwoFactorSignInAsync(
            TokenOptions.DefaultEmailProvider,
            request.TFACode,
            false,
            request.RememberDevice);

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