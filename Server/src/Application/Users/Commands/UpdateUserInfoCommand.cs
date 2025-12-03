using Application.Services;
using Domain.Users;
using Domain.Users.ValueObjects;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Users.Commands;

public record class UpdateUserInfoCommand(
    string? FirstName,
    string? LastName,
    string? Biography) : IRequest<Result<UpdateUserInfoCommandResponse>>;

public sealed record UpdateUserInfoCommandResponse
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string? Biography { get; set; }
}
internal sealed class UpdateUserInfoCommandHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager) : IRequestHandler<UpdateUserInfoCommand, Result<UpdateUserInfoCommandResponse>>
{
    public async Task<Result<UpdateUserInfoCommandResponse>> Handle(UpdateUserInfoCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        AppUser? user = await userManager.FindByIdAsync(userId.ToString());

        if (user is null)
        {
            return Result<UpdateUserInfoCommandResponse>.Failure("Kullanıcı bulunamadı.");
        }

        FirstName? firstName = request.FirstName is not null
                                 ? new(request.FirstName)
                                 : null;
        LastName? lastName = request.LastName is not null
                                ? new(request.LastName)
                                : null;

        user.UpdateInfo(firstName, lastName, request.Biography);

        await userManager.UpdateAsync(user);

        UpdateUserInfoCommandResponse updateUserInfoCommandResponse = new()
        {
            FirstName = user.FirstName.Value,
            LastName = user.LastName.Value,
            FullName = user.FullName,
            Biography = user.Biography
        };

        return updateUserInfoCommandResponse;
    }
}