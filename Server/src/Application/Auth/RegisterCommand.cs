using Domain.Users;
using Domain.Users.ValueObjects;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TS.Result;

namespace Application.Auth
{
    public sealed record RegisterCommand(string UserName,
        string Email,
        string Password, string FirstName, string LastName, string FullName) : IRequest<Result<string>>;

    internal sealed class RegisterCommandHandler(UserManager<AppUser> userManager) : IRequestHandler<RegisterCommand, Result<string>>
    {
        public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            FirstName firstName = new(request.FirstName);
            LastName lastName = new(request.LastName);
            FullName fullName = new(request.FullName);


            AppUser user = new()
            {
                UserName = request.UserName,
                Email = request.Email,
                CreatedAt = DateTimeOffset.Now,
                
                FirstName = firstName,
                LastName = lastName,
                FullName = fullName,
                CreatedBy = Guid.NewGuid(),
            };

            var result = await userManager.CreateAsync(user, request.Password);

            if(!result.Succeeded)
            {
               return Result<string>.Failure(result.Errors.Select(e => e.Description).ToList());
            }

            return "Kullanıcı başarıyla oluşturuldu";
        }
    }
}
