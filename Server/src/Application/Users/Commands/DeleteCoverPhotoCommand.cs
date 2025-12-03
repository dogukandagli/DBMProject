using Application.Services;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Users.Commands;

public sealed record DeleteCoverPhotoCommand() : IRequest<Result<string>>;

internal sealed class DeleteCoverPhotoCommandHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager) : IRequestHandler<DeleteCoverPhotoCommand, Result<string>>
{
    public async Task<Result<string>> Handle(DeleteCoverPhotoCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        AppUser? user = await userManager.FindByIdAsync(userId.ToString());

        if (user is null)
        {
            return Result<string>.Failure("Kullanıcı bulunamadı.");
        }

        user.DeleteCoverPhoto();

        await userManager.UpdateAsync(user);

        return "Kapak fotoğrafınız başarıyla silindi.";

    }
}