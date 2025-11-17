using Application.Services;
using Domain.Abstractions;
using Domain.Neighborhoods;
using Domain.Shared.EmailTemplate;
using Domain.Users;
using Domain.Users.ValueObjects;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using TS.Result;

namespace Application.Auth;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    int NeighborhoodId,
    DateOnly BirthDate) : IRequest<Result<string>>;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(p => p.Email)
        .NotEmpty().WithMessage("Geçerli bir mail adresi giriniz.")
        .EmailAddress().WithMessage("Geçerli bir mail adresi giriniz.");

        RuleFor(p => p.Password)
            .NotEmpty().WithMessage("Geçerli bir şifre giriniz.");

        RuleFor(p => p.FirstName)
            .NotEmpty().WithMessage("Geçerli bir ad giriniz.");
        RuleFor(p => p.LastName)
           .NotEmpty().WithMessage("Geçerli bir soy ad giriniz.");
        RuleFor(p => p.NeighborhoodId)
           .NotEmpty().WithMessage("Geçerli bir mahalle giriniz.")
           .GreaterThan(0).WithMessage("Geçerli bir mahalle giriniz.");
        RuleFor(p => p.BirthDate)
             .NotEmpty().WithMessage("Geçerli doğum tarihi giriniz.")
             .GreaterThan(DateOnly.FromDateTime(DateTime.UtcNow).AddYears(-100))
             .WithMessage("Doğum tarihi 100 yıldan daha eski olamaz.")
             .LessThan(DateOnly.FromDateTime(DateTime.UtcNow))
             .WithMessage("Doğum tarihi gelecekte olamaz.");
    }
}


internal sealed class RegisterCommandHandler(UserManager<AppUser> userManager,
    IMailService mailService,
    IAppSettings appSettings,
    INeighborhoodRepository neighborhoodRepository
    ) : IRequestHandler<RegisterCommand, Result<string>>
{
    public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        AppUser? appUser = await userManager.FindByEmailAsync(request.Email);

        if (appUser is not null)
        {
            return Result<string>.Failure("Bu maile ait kullanıcı var!");
        }

        bool neighborhoodExists = await neighborhoodRepository.AnyAsync(n => n.Id == request.NeighborhoodId);

        if (!neighborhoodExists)
        {
            return Result<string>.Failure("Geçersiz mahalle seçimi.");
        }

        FirstName firstName = new(request.FirstName);
        LastName lastName = new(request.LastName);

        AppUser user = new(request.Email, firstName, lastName, request.NeighborhoodId, request.BirthDate, null, null
            );

        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return Result<string>.Failure(result.Errors.Select(e => e.Description).ToList());
        }

        string baseUrl = appSettings.GetBaseUrl();
        var mailtoken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(mailtoken));
        var confirmationLink = $"{baseUrl}/ConfirmEmail/{user.Id}/{encodedToken}";

        string to = user.Email!;
        IEmailTemplate emailTemplate = new EmailConfirmationTemplate(confirmationLink, user.UserName!);

        await mailService.SendAsync(to, emailTemplate, cancellationToken);

        return "Mail adresinize onaylama gitmiştir.";
    }
}
