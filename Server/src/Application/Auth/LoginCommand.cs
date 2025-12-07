using Application.Services;
using Application.Users.Interfaces;
using Domain.Abstractions;
using Domain.Shared.EmailTemplate;
using Domain.Users;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using TS.Result;

namespace Application.Auth;

public sealed record LoginCommand(
    string Email
    , string Password) : IRequest<Result<LoginCommandResponse>>;

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email veya kullanıcı adı zorunludur.")
           .EmailAddress().WithMessage("Geçerli bir mail adresi giriniz.")
            .MaximumLength(100).WithMessage("Email adı çok uzun.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Şifre zorunludur.")
            .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.");
    }
}

public sealed record LoginCommandResponse
{
    public string Token { get; set; } = default!;
    public UserDto userDto { get; set; } = default!;
}

internal sealed class LoginCommandHandler(
    UserManager<AppUser> userManager,
    IMailService mailService,
    IJwtProvider jwtProvider,
    IAppSettings appSettings,
    IUserReadService userReadService) : IRequestHandler<LoginCommand, Result<LoginCommandResponse>>
{
    public async Task<Result<LoginCommandResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        AppUser? appUser = await userManager.FindByEmailAsync(request.Email);
        if (appUser is null)
            return Result<LoginCommandResponse>.Failure("Kullanıcı bulunumadı");


        if (await userManager.IsLockedOutAsync(appUser))
        {
            TimeSpan? timeSpan = appUser.LockoutEnd - DateTime.UtcNow;
            if (timeSpan is not null)
                return Result<LoginCommandResponse>.Failure($"Hesabınız kilitli. {Math.Ceiling(timeSpan.Value.TotalMinutes)} dakika sonra tekrar deneyin.");
        }

        bool checkPassword = await userManager.CheckPasswordAsync(appUser, request.Password);

        if (!checkPassword)
        {
            await userManager.AccessFailedAsync(appUser);
            return Result<LoginCommandResponse>.Failure("Şifreniz yanlış");
        }
        await userManager.ResetAccessFailedCountAsync(appUser);

        bool checkEmail = await userManager.IsEmailConfirmedAsync(appUser);

        if (!checkEmail)
        {
            var mailtoken = await userManager.GenerateEmailConfirmationTokenAsync(appUser);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(mailtoken));
            var confirmationLink = $"{appSettings.GetBaseUrl}/ConfirmEmail/{appUser.Id}/{encodedToken}";

            string to = appUser.Email!;
            IEmailTemplate emailTemplate = new EmailConfirmationTemplate(confirmationLink, appUser.UserName!);

            await mailService.SendAsync(to, emailTemplate, cancellationToken);

            return Result<LoginCommandResponse>.Failure("Mail adresiniz onayli değil,Mailinizi kontrol ediniz!");
        }

        string token = await jwtProvider.CreateTokenAsync(appUser, cancellationToken);
        string refreshToken = await jwtProvider.CreateRefreshTokenAsync(appUser, cancellationToken);

        UserDto? userDto = await userReadService.GetUserDtoAsync(appUser.Id, cancellationToken);

        if (userDto == null)
        {
            return Result<LoginCommandResponse>.Failure("Oturum bilgisi bulunamadı.");
        }

        LoginCommandResponse loginCommandResponse = new()
        {
            Token = token,
            userDto = userDto,
        };

        return loginCommandResponse;
    }
}