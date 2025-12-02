using MediatR;
using TS.Result;

namespace Application.Auth;

public sealed record LogoutCommand : IRequest<Result<bool>>;

internal sealed class LogoutCommandHandler(
    ) : IRequestHandler<LogoutCommand, Result<bool>>
{
    public Task<Result<bool>> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {

        return Task.FromResult(Result<bool>.Succeed(true));
    }
}