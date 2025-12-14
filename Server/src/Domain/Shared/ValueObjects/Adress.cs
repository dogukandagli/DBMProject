namespace Domain.Shared.ValueObjects;

public sealed record Address
{
    public string City { get; init; } = default!;
    public string District { get; init; } = default!;
    public string Neighborhood { get; init; } = default!;
    public string Street { get; init; } = default!;
    public string? BuildingNo { get; init; }
    public string? PostalCode { get; init; }

    public string FullAddress
    {
        get
        {
            var streetPart = Street;

            if (!string.IsNullOrWhiteSpace(BuildingNo))
                streetPart += $" No:{BuildingNo}";

            var neighborhoodPart = Neighborhood;

            var districtCityPart = $"{District}/{City}";

            return $"{streetPart}, {neighborhoodPart}, {districtCityPart}";
        }
    }

    public static Address Create(
        string? route,
        string? streetNumber,
        string? neighborhood,
        string? district,
        string? city,
        string? postalCode)
    {
        if (string.IsNullOrWhiteSpace(city))
            throw new ArgumentNullException("Şehir bilgisi bulunamadı.");
        if (string.IsNullOrEmpty(district))
            throw new ArgumentNullException("İlçe bilgisi bulunamadı.");
        if (string.IsNullOrEmpty(neighborhood))
            throw new ArgumentNullException("Mahalle bilgisi bulunamadı.");
        if (string.IsNullOrEmpty(route))
            throw new ArgumentNullException("Sokak veya cadde bilgisi bulunamadı.");

        return new Address
        {
            City = city,
            District = district,
            Neighborhood = neighborhood,
            Street = route,
            BuildingNo = streetNumber,
            PostalCode = postalCode
        };
    }
}
