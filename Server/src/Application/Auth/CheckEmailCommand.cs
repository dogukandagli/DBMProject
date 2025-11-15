using Domain.Users;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record CheckEmailCommand(string Email) : IRequest<Result<bool>>;

public sealed class CheckEmailCommandValidator : AbstractValidator<CheckEmailCommand>
{
    public CheckEmailCommandValidator()
    {
        RuleFor(x => x.Email)
           .NotEmpty().WithMessage("Email veya kullanıcı adı zorunludur.")
          .EmailAddress().WithMessage("Geçerli bir mail adresi giriniz.")
           .MaximumLength(100).WithMessage("Email adı çok uzun.");
    }
}

internal sealed class CheckEmailCommandHandler(
    UserManager<AppUser> userManager) : IRequestHandler<CheckEmailCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(CheckEmailCommand request, CancellationToken cancellationToken)
    {
        AppUser? user = await userManager.FindByEmailAsync(request.Email);

        if (user is not null)
        {
            return Result<bool>.Failure("Bu e-posta adresi zaten kayıtlıdır.");
        }
        return true;
    }
}