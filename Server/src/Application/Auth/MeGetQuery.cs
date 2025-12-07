using Application.Services;
using Application.Users.Interfaces;
using MediatR;
using TS.Result;

namespace Application.Auth;

public sealed record MeGetQuery() : IRequest<Result<UserDto>>;

internal sealed class MeGetQueryHandler(
    IClaimContext claimContext,
    IUserReadService userReadService
    ) : IRequestHandler<MeGetQuery, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(MeGetQuery request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        if (userId == Guid.Empty)
        {
            return Result<UserDto>.Failure("Oturum bilgisi bulunamadı.");
        }

        UserDto? userDto = await userReadService.GetUserDtoAsync(userId, cancellationToken);

        if (userDto == null)
        {
            return Result<UserDto>.Failure("Oturum bilgisi bulunamadı.");
        }

        return userDto;
    }
}