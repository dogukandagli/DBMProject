using Application.Services;
using Domain.Users;
using GenericFileService.Files;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Users;

public sealed record UpdateProfilePhotoCommand : IRequest<Result<UpdateProfilePhotoCommandResponse>>
{
    public IFormFile FormFile { get; set; } = default!;
};

public sealed record UpdateProfilePhotoCommandResponse(string Message, string ProfilePhotoUrl);

public sealed class UpdateProfilePhotoCommandHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager) : IRequestHandler<UpdateProfilePhotoCommand, Result<UpdateProfilePhotoCommandResponse>>
{
    public async Task<Result<UpdateProfilePhotoCommandResponse>> Handle(UpdateProfilePhotoCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        AppUser? user = await userManager.FindByIdAsync(userId.ToString());

        if (user is null)
        {
            return Result<UpdateProfilePhotoCommandResponse>.Failure("Kullanıcı bulunamadı.");
        }

        IFormFile photoProfile = request.FormFile;

        if (photoProfile is not null)
        {
            if (!photoProfile.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                Result<string>.Failure("Desteklenmeyen dosya tipi");
            }

            string profilePhotoUrl = FileService.FileSaveToServer(photoProfile, "wwwroot/user-profilephoto/");

            user.SetPhotoUrl(profilePhotoUrl);
        }

        await userManager.UpdateAsync(user);

        UpdateProfilePhotoCommandResponse updateProfilePhotoCommandResponse = new("Profil fotunuz başarıyla değiştirildi.", user.ProfilePhotoUrl!);
        return updateProfilePhotoCommandResponse;
    }
}