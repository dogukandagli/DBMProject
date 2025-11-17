namespace Domain.Shared;

public class Geolocation
{
    public double? Latitude { get; }
    public double? Longitude { get; }

    private Geolocation(double? latitude, double? longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }

    public static Geolocation Create(double? latitude, double? longitude)
    {
        if (latitude is null && longitude is null)
            return Empty;

        if (latitude < -90 || latitude > 90)
            throw new ArgumentException("Enlem -90 ile 90 arasında olmalıdır.");

        if (longitude < -180 || longitude > 180)
            throw new ArgumentException("Enlem -180 ile 180 arasında olmalıdır.");

        return new Geolocation(latitude, longitude);
    }

    public static Geolocation Empty { get; } = new Geolocation(null, null);

    public bool IsEmpty => Latitude is null || Longitude is null;
}