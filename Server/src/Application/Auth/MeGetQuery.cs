using Application.Services;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record MeGetQuery() : IRequest<Result<UserDto>>;

internal sealed class MeGetQueryHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager
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

        UserDto? userDto = await users.MapToUserDto(userId, cancellationToken);

        if (userDto == null)
        {
            return Result<UserDto>.Failure("Oturum bilgisi bulunamadı.");
        }

        return userDto;
    }
}