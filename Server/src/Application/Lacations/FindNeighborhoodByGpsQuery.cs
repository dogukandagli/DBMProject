using Application.Services;
using Domain.Neighborhoods;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TS.Result;

namespace Application.Lacations;

public sealed record FindNeighborhoodByGpsQuery(
    double Latitude,
    double Longitude
    ) : IRequest<Result<GpsVerificationResponse>>;

public sealed class FindNeighborhoodByGpsQueryValidator : AbstractValidator<FindNeighborhoodByGpsQuery>
{
    public FindNeighborhoodByGpsQueryValidator()
    {
        RuleFor(p => p.Latitude)
            .NotEmpty();
        RuleFor(p => p.Longitude)
            .NotEmpty();
    }
}

public sealed record GpsVerificationResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string VerificationTicket { get; set; } = default!;
}

internal sealed class FindNeighborhoodByGpsQueryHandler(
    IGoogleMapsService googleMapsService,
    INeighborhoodRepository neighborhoodRepository,
    IDistrictRepostiory districtRepostiory,
    ICityRepostiory cityRepostiory,
    ITempTokenProvider tempTokenProvider
    ) : IRequestHandler<FindNeighborhoodByGpsQuery, Result<GpsVerificationResponse>>
{
    public async Task<Result<GpsVerificationResponse>> Handle(FindNeighborhoodByGpsQuery request, CancellationToken cancellationToken)
    {
        var googleResult = await googleMapsService.GetAddressFromCoordinatesAsync(request.Latitude,
                                                                                request.Longitude,
                                                                              cancellationToken);

        if (!googleResult.IsSuccessful)
        {
            return Result<GpsVerificationResponse>.Failure(googleResult.ErrorMessages);
        }

        var query =
            from n in neighborhoodRepository.GetAll()
            join d in districtRepostiory.GetAll() on n.DistrictId equals d.Id
            join c in cityRepostiory.GetAll() on d.CityId equals c.Id
            where
                n.Name == googleResult.Data.Neighborhood &&
                d.Name == googleResult.Data.District &&
                c.Name == googleResult.Data.City
            select n;

        Neighborhood? neighborhood = await query.FirstOrDefaultAsync(cancellationToken);


        if (neighborhood == null)
        {
            return Result<GpsVerificationResponse>.Failure("Konumunuz eşleşmedi.");
        }

        string ticket = tempTokenProvider.GenerateTicket(neighborhood.Id,
            request.Latitude,
            request.Longitude,
            TimeSpan.FromMinutes(5));

        GpsVerificationResponse gpsVerificationResponse = new()
        {
            Id = neighborhood.Id,
            Name = neighborhood.Name,
            VerificationTicket = ticket,
        };

        return gpsVerificationResponse;
    }
}