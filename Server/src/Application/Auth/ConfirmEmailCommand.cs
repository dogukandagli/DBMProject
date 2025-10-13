using Domain.Users;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using TS.Result;

namespace Application.Auth;

public sealed record ConfirmEmailCommand(
    string UserId, string MailToken) : IRequest<Result<string>>;

public sealed class ConfirmEmailCommandValidator : AbstractValidator<ConfirmEmailCommand>
{
    public ConfirmEmailCommandValidator()
    {
        RuleFor(P => P.MailToken).NotEmpty().WithMessage("Token geçersiz");
        RuleFor(p => p.UserId).NotEmpty().WithMessage("Kullanıcı id geçersiz");
    }
}

internal sealed class ConfirmEmailCommandHandler(
    UserManager<AppUser> userManager) : IRequestHandler<ConfirmEmailCommand, Result<string>>
{
    public async Task<Result<string>> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        AppUser? user = await userManager.FindByIdAsync(request.UserId);
        if (user is null)
            return Result<string>.Failure("Kullanıcı Bulunamadı");

        if (user.EmailConfirmed)
        {
            return "E-posta adresiniz zaten onaylanmış.";
        }
        string decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.MailToken));

        IdentityResult result = await userManager.ConfirmEmailAsync(user!, decodedToken);

        if (!result.Succeeded)
        {
            return Result<string>.Failure("Mail adresiniz onaylanamadı!");
        }

        return "Mail Adresiniz onaylandi";
    }
}