using Application.Common.Interfaces;
using Application.Services;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;


namespace Application.Behaviors;

public sealed class VerificationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IVerifiedUserRequest
{
    private readonly IClaimContext claimContext;
    private readonly UserManager<AppUser> userManager;
    public VerificationBehavior(
        IClaimContext _claimContext,
        UserManager<AppUser> _userManager
        )
    {
        claimContext = _claimContext;
        userManager = _userManager;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var userId = claimContext.GetUserId();
        if (userId == Guid.Empty)
        {
            throw new AuthorizationException();
        }

        var user = await userManager.FindByIdAsync(userId.ToString());

        if (user is null)
        {
            throw new AuthorizationException();
        }

        if (user.IsLocationVerified is false)
        {
            throw new AuthorizationException("Bu işlemi yapmak için konumunuzu doğrulamanız gerekmektedir.");
        }
        return await next();
    }
}

public sealed class AuthorizationException : Exception
{
    public AuthorizationException() : base("Bu işlem için yetkiniz bulunmamaktadır.")
    {
    }

    public AuthorizationException(string message) : base(message)
    {
    }
}