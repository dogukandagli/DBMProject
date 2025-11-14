using Application.Services;
using Domain.Abstractions;
using Domain.Shared.EmailTemplate;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using TS.Result;

namespace Application.Auth;

public sealed record LoginCommand(
    string EmailOrUserName
    , string Password) : IRequest<Result<LoginCommandResponse>>;

public sealed record LoginCommandResponse
{
    public string? Token { get; set; }
    public bool? Requires2fa { get; set; }
}

internal sealed class LoginCommandHandler(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager,
    IMailService mailService,
    IJwtProvider jwtProvider) : IRequestHandler<LoginCommand, Result<LoginCommandResponse>>
{
    public async Task<Result<LoginCommandResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        AppUser? appUser = await userManager.FindByEmailAsync(request.EmailOrUserName);
        if (appUser is null)
            appUser = await userManager.FindByNameAsync(request.EmailOrUserName);

        if (appUser is null)
            return Result<LoginCommandResponse>.Failure("Kullanıcı bulunumadı");

        LoginCommandResponse loginCommandResponse = new();

        SignInResult signInResult = await signInManager.CheckPasswordSignInAsync(appUser, request.Password, true);

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
            var mailtoken = await userManager.GenerateEmailConfirmationTokenAsync(appUser);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(mailtoken));
            var confirmationLink = $"localhost:5173/ConfirmEmail/{appUser.Id}/{encodedToken}";

            string to = appUser.Email!;
            IEmailTemplate emailTemplate = new EmailConfirmationTemplate(confirmationLink, appUser.UserName!);

            await mailService.SendAsync(to, emailTemplate, cancellationToken);

            return Result<LoginCommandResponse>.Failure("Mail adresiniz onayli değil,Mailinizi kontrol ediniz!");
        }

        if (!signInResult.Succeeded)
        {
            return Result<LoginCommandResponse>.Failure("Şifreniz yanlış");
        }

        //if (appUser.TwoFactorEnabled)
        //{

        //    //if (false)  buraya eger cihaz kayitliysa direk tokeni gondericez.
        //    //{
        //    //    //jwt token uret 
        //    //    loginCommandResponse.Token = "bu cihaz kayitli 2fa gerek yok";

        //    //    return loginCommandResponse;
        //    //}
        //    string twoFactorCode = await userManager.GenerateTwoFactorTokenAsync(appUser, TokenOptions.DefaultEmailProvider);

        //    string to = appUser.Email!;
        //    IEmailTemplate emailTemplate = new TwoFactorAuthTemplate(twoFactorCode, appUser.FullName);

        //    await mailService.SendAsync(to, emailTemplate, cancellationToken);

        //    loginCommandResponse.Requires2fa = true;

        //    return loginCommandResponse;
        //}
        string token = await jwtProvider.CreateTokenAsync(appUser, cancellationToken);
        string refreshToken = await jwtProvider.CreateRefreshTokenAsync(appUser, cancellationToken);
        loginCommandResponse.Token = token;

        return loginCommandResponse;
    }
}