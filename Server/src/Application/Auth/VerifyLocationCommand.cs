using Application.Services;
using Domain.Shared;
using Domain.Users;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Auth;

public sealed record VerifyLocationCommand(
    double Latitude,
    double Longitude) : IRequest<Result<VerifyLocationCommandResponse>>;

public sealed class VerifyLocationCommandValidator : AbstractValidator<VerifyLocationCommand>
{
    public VerifyLocationCommandValidator()
    {
        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("Geçersiz enlem (latitude) değeri.")
            .NotEqual(0).WithMessage("Konum bilgisi alınamadı.");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("Geçersiz boylam (longitude) değeri.")
            .NotEqual(0).WithMessage("Konum bilgisi alınamadı.");
    }
}

public sealed record VerifyLocationCommandResponse(bool IsVerified);

internal sealed class VerifyLocationCommandHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager) : IRequestHandler<VerifyLocationCommand, Result<VerifyLocationCommandResponse>>
{
    public async Task<Result<VerifyLocationCommandResponse>> Handle(VerifyLocationCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        if (userId == Guid.Empty)
        {
            return Result<VerifyLocationCommandResponse>.Failure("Kullanıcı bulunamadı.");
        }

        AppUser? appUser = await userManager.FindByIdAsync(userId.ToString());

        if (appUser is null)
        {
            return Result<VerifyLocationCommandResponse>.Failure("Kullanıcı mevcut değil.");
        }

        Geolocation deviceLocation = Geolocation.Create(request.Latitude, request.Longitude);

        appUser.Verify(deviceLocation);

        VerifyLocationCommandResponse verifyLocationCommandResponse = new(appUser.IsLocationVerified);

        return verifyLocationCommandResponse;
    }
}