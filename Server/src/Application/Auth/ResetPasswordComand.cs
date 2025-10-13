using Domain.Users;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record ResetPasswordComand(
    Guid Id,
    string ForgotPasswordCode,
    string NewPassword
    ) : IRequest<Result<string>>;

public sealed class ResetPasswordComandValidator : AbstractValidator<ResetPasswordComand>
{
    public ResetPasswordComandValidator()
    {
        RuleFor(p => p.NewPassword).NotEmpty().WithMessage("Geçerli bir yeni şifre girin");
    }
}

internal sealed class ResetPasswordComandHandler(
    UserManager<AppUser> userManager) : IRequestHandler<ResetPasswordComand, Result<string>>
{
    public async Task<Result<string>> Handle(ResetPasswordComand request, CancellationToken cancellationToken)
    {
        AppUser? user = await userManager.FindByIdAsync(request.Id.ToString());

        if (user is null)
            return Result<string>.Failure("Kullanıcı bulunamadı");

        var isValid = await userManager.VerifyUserTokenAsync(
            user,
            userManager.Options.Tokens.PasswordResetTokenProvider,
            "ResetPassword",
            request.ForgotPasswordCode);

        if (!isValid)
            return Result<string>.Failure("Bağlantının süresi dolmuş veya doğrulama kodu geçersiz.");

        var result = await userManager.ResetPasswordAsync(user, request.ForgotPasswordCode, request.NewPassword);

        if (!result.Succeeded)
            return Result<string>.Failure("Şifre sıfırlanamadı.");

        return "Şifre başarıyla güncellendi.";
    }
}