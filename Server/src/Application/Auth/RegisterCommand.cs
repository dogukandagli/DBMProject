using Application.Services;
using Domain.Abstractions;
using Domain.Shared.EmailTemplate;
using Domain.Users;
using Domain.Users.ValueObjects;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using TS.Result;

namespace Application.Auth;

public sealed record RegisterCommand(string UserName,
    string Email,
    string Password, string FirstName, string LastName) : IRequest<Result<string>>;

internal sealed class RegisterCommandHandler(UserManager<AppUser> userManager,
    IMailService mailService,
    IAppSettings appSettings
    ) : IRequestHandler<RegisterCommand, Result<string>>
{
    public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        FirstName firstName = new(request.FirstName);
        LastName lastName = new(request.LastName);


        AppUser user = new(
            firstName, lastName
            );
        user.Email = request.Email;
        user.UserName = request.UserName;


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

        return "Mail adresinizi onaylayınız.";
    }
}
