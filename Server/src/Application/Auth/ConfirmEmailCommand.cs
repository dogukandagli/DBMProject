using Application.Services;
using Domain.Users;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using TS.Result;

namespace Application.Auth;

public sealed record ConfirmEmailCommand(
    string UserId, string MailToken) : IRequest<Result<ConfirmEmailCommandResponse>>;

public sealed class ConfirmEmailCommandValidator : AbstractValidator<ConfirmEmailCommand>
{
    public ConfirmEmailCommandValidator()
    {
        RuleFor(P => P.MailToken).NotEmpty().WithMessage("Token geçersiz");
        RuleFor(p => p.UserId).NotEmpty().WithMessage("Kullanıcı id geçersiz");
    }
}
public sealed record ConfirmEmailCommandResponse
{
    public string Token { get; set; } = default!;
    public UserDto userDto { get; set; } = default!;

}

internal sealed class ConfirmEmailCommandHandler(
    UserManager<AppUser> userManager,
    IJwtProvider jwtProvider) : IRequestHandler<ConfirmEmailCommand, Result<ConfirmEmailCommandResponse>>
{
    public async Task<Result<ConfirmEmailCommandResponse>> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        AppUser? user = await userManager.FindByIdAsync(request.UserId);
        if (user is null)
            return Result<ConfirmEmailCommandResponse>.Failure("Kullanıcı Bulunamadı");


        string decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.MailToken));

        IdentityResult result = await userManager.ConfirmEmailAsync(user!, decodedToken);

        if (!result.Succeeded)
        {
            return Result<ConfirmEmailCommandResponse>.Failure("Mail adresiniz onaylanamadı!");
        }
        string token = await jwtProvider.CreateTokenAsync(user, cancellationToken);
        string refreshToken = await jwtProvider.CreateRefreshTokenAsync(user, cancellationToken);


        UserDto? userDto = await userManager.Users.MapToUserDto(user.Id, cancellationToken);

        if (userDto == null)
        {
            return Result<ConfirmEmailCommandResponse>.Failure("Oturum bilgisi bulunamadı.");
        }

        ConfirmEmailCommandResponse response = new()
        {
            Token = token,
            userDto = userDto
        };

        return response;
    }
}