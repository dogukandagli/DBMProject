namespace Domain.Shared.ValueObjects;

public sealed record Address
{
    public int City { get; init; }
    public int District { get; init; }
    public int Neighborhood { get; init; }
    public string? PostalCode { get; init; }
    public string StreetAddress { get; init; } = default!;
    public string FormattedAddress { get; init; } = default!;
    public Geolocation Location { get; init; } = default!;

    public static Address Create(
        int city,
        int district,
        int neighborhood,
        string postalCode,
        string formattedAddress,
        string streetAddress,
        Geolocation location
        )
    {
        return new Address
        {
            City = city,
            District = district,
            Neighborhood = neighborhood,
            PostalCode = postalCode,
            StreetAddress = streetAddress,
            FormattedAddress = formattedAddress,
            Location = location
        };
    }
}
