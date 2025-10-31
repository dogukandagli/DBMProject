using Application.Services;
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

public sealed record ForgotPasswordCommand(string Email) : IRequest<Result<string>>;

public sealed class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
{
    public ForgotPasswordCommandValidator()
    {
        RuleFor(p => p.Email)
        .NotEmpty().WithMessage("Geçerli bir mail adresi girin")
        .EmailAddress().WithMessage("Geçerli bir mail adresi girin");
    }
}

internal sealed class ForgotPasswordCommandHandler(
    UserManager<AppUser> userManager,
    IMailService mailService,
    IAppSettings appSettings) : IRequestHandler<ForgotPasswordCommand, Result<string>>
{
    public async Task<Result<string>> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        AppUser? user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return Result<string>.Failure("Kullanıcı bulunamadı");

        string forgotPasswordToken = await userManager.GeneratePasswordResetTokenAsync(user);
        string to = user.Email!;

        var forgotPasswordCode = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(forgotPasswordToken));

        string baseUrl = appSettings.GetBaseUrl();

        var confirmationLink = $"{baseUrl}/reset-password/{user.Id}/{forgotPasswordCode}";

        IEmailTemplate emailTemplate = new ForgotPasswordTemplate(user.UserName!, confirmationLink);

        await mailService.SendAsync(to, emailTemplate, cancellationToken);
        return "Şifre sıfırlama mailiniz gönderilmiştir. Lütfen mail adresinizi kontrol edin";
    }
}