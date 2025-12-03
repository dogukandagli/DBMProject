using Application.Services;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Users.Commands;

public sealed record DeleteProfilePhotoCommand : IRequest<Result<string>>;

public sealed class DeleteProfilePhotoCommandHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager) : IRequestHandler<DeleteProfilePhotoCommand, Result<string>>
{
    public async Task<Result<string>> Handle(DeleteProfilePhotoCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        AppUser? user = await userManager.FindByIdAsync(userId.ToString());

        if (user is null)
        {
            return Result<string>.Failure("Kullanıcı bulunamadı.");
        }

        user.DeleteProfilePhoto();

        await userManager.UpdateAsync(user);

        return "Profil fotoğrafınız başarıyla silindi.";
    }
}