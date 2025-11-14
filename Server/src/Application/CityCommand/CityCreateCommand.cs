using Domain.Neighborhoods;
using MediatR;
using TS.Result;

namespace Application.CityCommand;

public sealed record CityCreateCommand(int id, string name) : IRequest<Result<bool>>;

internal sealed class CityCreateCommandHandler
    : IRequestHandler<CityCreateCommand, Result<bool>>
{
    public Task<Result<bool>> Handle(CityCreateCommand request, CancellationToken cancellationToken)
    {

        var city = new City(request.id, request.name);


        var result = Result<bool>.Succeed(true);
        return Task.FromResult(result);
    }
}