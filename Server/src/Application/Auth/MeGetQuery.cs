using Application.Services;
using Domain.Neighborhoods;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record MeGetQuery() : IRequest<Result<UserDto>>;

internal sealed class MeGetQueryHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager,
    ICityRepostiory cityRepostiory,
    IDistrictRepostiory districtRepostiory,
    INeighborhoodRepository neighborhoodRepository
    ) : IRequestHandler<MeGetQuery, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(MeGetQuery request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        if (userId == Guid.Empty)
        {
            return Result<UserDto>.Failure("Oturum bilgisi bulunamadı.");
        }

        var users = userManager.Users;

        UserDto? userDto = await userManager.Users.MapToUserDto(
           cityRepostiory.GetAll(),
           districtRepostiory.GetAll(),
           neighborhoodRepository.GetAll(),
           userId,
           cancellationToken);

        if (userDto == null)
        {
            return Result<UserDto>.Failure("Oturum bilgisi bulunamadı.");
        }
        var appUser = await userManager.FindByIdAsync(userId.ToString());
        if (appUser is not null)
        {
            var roles = await userManager.GetRolesAsync(appUser);
            userDto.Role = roles.FirstOrDefault() ?? "User";
        }
        return userDto;
    }
}