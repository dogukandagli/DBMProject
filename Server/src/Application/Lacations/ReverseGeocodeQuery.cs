using Application.Common.Models;
using Application.Services;
using MediatR;
using TS.Result;

namespace Application.Lacations;

public sealed record ReverseGeocodeQuery(double Latitude,
    double Longitude) : IRequest<Result<PhysicalAddressDto>>;

public sealed record PhysicalAddressDto(
    string? StreetAddress,
    string? City,
    string? District,
    string? PostalCode,
    string? Country,
    GeoPointDto GeoPoint,
    string? FormattedAddress
    );
public record GeoPointDto(
    double LatDegrees,
    double LonDegrees
);

internal sealed class ReverseGeocodeQueryHandler(
    IMapsService mapsService) : IRequestHandler<ReverseGeocodeQuery, Result<PhysicalAddressDto>>
{
    public async Task<Result<PhysicalAddressDto>> Handle(ReverseGeocodeQuery request, CancellationToken cancellationToken)
    {
        AddressDto googleResult = await mapsService.GetAddressFromCoordinatesAsync(request.Latitude, request.Longitude, cancellationToken);

        GeoPointDto geoPointDto = new(googleResult.Latitude, googleResult.Longitude);

        PhysicalAddressDto physicalAddressDto = new(
            googleResult.Street,
            googleResult.City,
            googleResult.District,
            googleResult.PostalCode,
            googleResult.Country,
            geoPointDto,
            googleResult.FormattedAddress);

        return physicalAddressDto;
    }
}