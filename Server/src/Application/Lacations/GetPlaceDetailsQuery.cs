using Application.Common.Models;
using Application.Services;
using MediatR;
using TS.Result;

namespace Application.Lacations;

public sealed record GetPlaceDetailsQuery(
    string PlaceId, string SessionToken) : IRequest<Result<PhysicalAddressDto>>;

internal sealed class GetPlaceDetailsQueryHandler(IPlaceDetailsService placeDetailsService) : IRequestHandler<GetPlaceDetailsQuery, Result<PhysicalAddressDto>>
{
    public async Task<Result<PhysicalAddressDto>> Handle(GetPlaceDetailsQuery request, CancellationToken cancellationToken)
    {
        var result = await placeDetailsService.GetPlaceDetailsAsync(request.PlaceId, request.SessionToken, cancellationToken);

        GeoPointDto geoPointDto = new(result.Latitude, result.Longitude);

        PhysicalAddressDto physicalAddressDto = new(
            result.Street,
            result.City,
            result.District,
            result.PostalCode,
            result.Country,
            geoPointDto,
            result.FormattedAddress);

        return physicalAddressDto;
    }
}