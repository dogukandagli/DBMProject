using Application.Services;
using Domain.Users;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record ChangePasswordCommand(
    string CurrentPassword,
    string NewPassword
) : IRequest<Result<string>>;

public sealed class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(p => p.CurrentPassword)
            .NotEmpty().WithMessage("Mevcut şifreyi girin");

        RuleFor(p => p.NewPassword)
            .NotEmpty().WithMessage("Geçerli bir yeni şifre girin");
    }
}

internal sealed class ChangePasswordCommandHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager
) : IRequestHandler<ChangePasswordCommand, Result<string>>
{
    public async Task<Result<string>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        AppUser? user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Result<string>.Failure("Kullanıcı bulunamadı");

        var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

        if (!result.Succeeded)
            return Result<string>.Failure(
    string.Join(" | ", result.Errors.Select(e => e.Description))
);


        return "Şifre başarıyla güncellendi.";
    }
}
