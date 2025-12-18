using Application.Services;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Users.Commands;

// PUBLIC yaparak erişim hatasını çözdük
public sealed record DeactivateAccountCommand() : IRequest<Result<string>>;

internal sealed class DeactivateAccountCommandHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager) : IRequestHandler<DeactivateAccountCommand, Result<string>>
{
    public async Task<Result<string>> Handle(DeactivateAccountCommand request, CancellationToken cancellationToken)
    {
        // 1. Arkadaşının dediği gibi ClaimContext üzerinden ID'yi al
        Guid userId = claimContext.GetUserId();

        // 2. UserManager ile kullanıcıyı bul
        AppUser? user = await userManager.FindByIdAsync(userId.ToString());

        if (user is null)
        {
            return Result<string>.Failure("Kullanıcı bulunamadı.");
        }

        // 3. KRİTİK NOKTA: Manager'dan silme, entity'deki metodu çağır
        user.Delete(); // Bu metod IsDeleted attribute'unu true yapar.

        // 4. Değişikliği veritabanına yansıt
        IdentityResult result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return Result<string>.Failure("Hesap silinirken hata oluştu.");
        }

        return Result<string>.Succeed("Hesabınız silindi.");
    }
}