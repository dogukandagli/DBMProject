using Application.Services;
using Domain.Users;
using GenericFileService.Files;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Users.Commands;

public sealed record UpdateCoverPhotoCommand : IRequest<Result<UpdateCoverPhotoCommandResponse>>
{
    public IFormFile CoverPhoto { get; set; } = default!;
}

public sealed record UpdateCoverPhotoCommandResponse(string Message, string CoverPhotoUrl);

public sealed class UpdateCoverPhotoCommandHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager
    ) : IRequestHandler<UpdateCoverPhotoCommand, Result<UpdateCoverPhotoCommandResponse>>
{
    public async Task<Result<UpdateCoverPhotoCommandResponse>> Handle(UpdateCoverPhotoCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        AppUser? user = await userManager.FindByIdAsync(userId.ToString());

        if (user is null)
        {
            return Result<UpdateCoverPhotoCommandResponse>.Failure("Kullanıcı bulunamadı.");
        }

        IFormFile coverPhoto = request.CoverPhoto;

        if (coverPhoto is not null)
        {
            if (!coverPhoto.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                Result<string>.Failure("Desteklenmeyen dosya tipi");
            }

            string coverPhotoUrl = FileService.FileSaveToServer(coverPhoto, "wwwroot/user-coverphoto/");

            user.SetCoverPhoto(coverPhotoUrl);
        }
        await userManager.UpdateAsync(user);

        UpdateCoverPhotoCommandResponse updateCoverPhotoCommandResponse =
            new("Kapak fotoğrafınız başarıyla değiştirildi.", user.CoverPhotoUrl!);

        return updateCoverPhotoCommandResponse;
    }
}