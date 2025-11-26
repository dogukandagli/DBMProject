namespace Application.Common.Models;

public sealed class AddressDto
{
    public string? City { get; set; }
    public string? District { get; set; }
    public string? Neighborhood { get; set; }
    public string? Street { get; set; }
    public string? BuildingNo { get; set; }
    public string? PostalCode { get; set; }
    public string? FormattedAddress { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? PlaceId { get; set; }
    public string? Country { get; set; }
}
