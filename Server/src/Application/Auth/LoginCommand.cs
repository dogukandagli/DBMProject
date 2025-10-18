using Application.Services;
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
            string subject = "Email Doğrulama";
            string body = $@"
            <!DOCTYPE html>
            <html lang='tr'>
            <head>
              <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
              <meta name='viewport' content='width=device-width, initial-scale=1.0' />
              <title>E-posta Doğrulama</title>
            </head>
            <body style='margin:0;padding:0;background-color:#f9f9f9;font-family:Segoe UI, Arial, sans-serif;color:#333;'>
              <table role='presentation' cellspacing='0' cellpadding='0' border='0' width='100%' style='background-color:#f9f9f9;padding:24px 0;'>
                <tr>
                  <td align='center'>
                    <table role='presentation' cellspacing='0' cellpadding='0' border='0' width='600' style='max-width:600px;width:100%;background:#ffffff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);'>
                      <tr>
                        <td style='padding:30px;'>
                          <h2 style='margin:0 0 16px 0;color:#2c3e50;font-weight:600;font-size:22px;'>Merhaba {appUser.UserName},</h2>
                          <p style='margin:0 0 12px 0;line-height:1.6;'>
                            Hesabınızı aktifleştirmek için e-posta adresinizi doğrulamanız gerekiyor.
                          </p>
                          <p style='margin:0 0 20px 0;line-height:1.6;'>
                            Aşağıdaki butona tıklayarak e-posta adresinizi doğrulayabilirsiniz:
                          </p>

                          <!-- Button -->
                          <table role='presentation' cellspacing='0' cellpadding='0' border='0' style='margin:0 0 20px 0;'>
                            <tr>
                              <td align='center' bgcolor='#007bff' style='border-radius:5px;'>
                                <a href='{confirmationLink}'
                                   style='display:inline-block;padding:12px 20px;text-decoration:none;color:#ffffff;font-weight:600;border-radius:5px;'>
                                  E-posta Adresimi Doğrula
                                </a>
                              </td>
                            </tr>
                          </table>

                          <!-- Fallback link -->
                          <p style='margin:0 0 12px 0;font-size:13px;color:#666;line-height:1.6;'>
                            Buton çalışmazsa şu bağlantıyı tarayıcınıza yapıştırın:
                          </p>
                          <p style='margin:0 0 20px 0;word-break:break-all;font-size:13px;color:#007bff;'>
                            <a href='{confirmationLink}' style='color:#007bff;text-decoration:underline;'>{confirmationLink}</a>
                          </p>

                          <p style='margin:0 0 0 0;line-height:1.6;'>
                            Eğer bu isteği siz yapmadıysanız, bu e-postayı yok sayabilirsiniz.
                          </p>

                          <div style='margin-top:30px;font-size:12px;color:#888;'>
                            Teşekkürler,<br /><strong>Uygulamanız Ekibi</strong>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>";

            await mailService.SendAsync(to, subject, body, cancellationToken);

            return Result<LoginCommandResponse>.Failure("Mail adresiniz onayli değil,Mailinizi kontrol ediniz!");
        }

        if (!signInResult.Succeeded)
        {
            return Result<LoginCommandResponse>.Failure("Şifreniz yanlış");
        }

        if (appUser.TwoFactorEnabled)
        {

            //if (false)  buraya eger cihaz kayitliysa direk tokeni gondericez.
            //{
            //    //jwt token uret 
            //    loginCommandResponse.Token = "bu cihaz kayitli 2fa gerek yok";

            //    return loginCommandResponse;
            //}
            string twoFactorCode = await userManager.GenerateTwoFactorTokenAsync(appUser, TokenOptions.DefaultEmailProvider);

            string to = appUser.Email!;
            string subject = "Çift Doğrulama Kodu";
            string body = $@"Merhaba {appUser.FullName.Value} , Doğrulama Kodunuz : {twoFactorCode}";

            await mailService.SendAsync(to, subject, body, cancellationToken);

            loginCommandResponse.Requires2fa = true;

            return loginCommandResponse;
        }
        string token = await jwtProvider.CreateTokenAsync(appUser, cancellationToken);
        string refreshToken = await jwtProvider.CreateRefreshTokenAsync(appUser, cancellationToken);
        loginCommandResponse.Token = token;

        return loginCommandResponse;
    }
}