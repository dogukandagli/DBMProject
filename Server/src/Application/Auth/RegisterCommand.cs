using Domain.Users;
using Domain.Users.ValueObjects;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record RegisterCommand(string UserName,
    string Email,
    string Password, string FirstName, string LastName) : IRequest<Result<string>>;

internal sealed class RegisterCommandHandler(UserManager<AppUser> userManager) : IRequestHandler<RegisterCommand, Result<string>>
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

        return "Kullanıcı başarıyla oluşturuldu";
    }
}
