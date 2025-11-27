namespace Application.Common.Models;

public sealed record PhysicalAddressDto(
    string? StreetAddress,
    string? City,
    string? District,
    string? Neighborhood,
    string? PostalCode,
    string? Country,
    GeoPointDto GeoPoint,
    string? FormattedAddress
    );
public record GeoPointDto(
    double LatDegrees,
    double LonDegrees
);
