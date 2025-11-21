namespace Application.Common.Models;

public sealed class AddressDto
{
    public string City { get; set; } = default!;
    public string District { get; set; } = default!;
    public string Neighborhood { get; set; } = default!;
    public string Street { get; set; } = default!;
    public string? BuildingNo { get; set; }
    public string? PostalCode { get; set; }
    public string FormattedAddress { get; set; } = default!;
}
