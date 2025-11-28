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

        if (latitude is null || longitude is null)
            throw new ArgumentException("Hem enlem hem boylam birlikte belirtilmelidir.");

        if (latitude < -90 || latitude > 90)
            throw new ArgumentException("Enlem -90 ile 90 arasında olmalıdır.");

        if (longitude < -180 || longitude > 180)
            throw new ArgumentException("Boylam -180 ile 180 arasında olmalıdır.");

        return new Geolocation(latitude, longitude);
    }

    public static Geolocation Empty { get; } = new Geolocation(null, null);

    public bool IsEmpty => Latitude is null || Longitude is null;

    public double DistanceTo(Geolocation other)
    {
        if (IsEmpty || other.IsEmpty)
        {
            throw new InvalidOperationException("Boş geolocation ile mesafe hesaplanamaz.");
        }

        double lat1 = Latitude!.Value;
        double lng1 = Longitude!.Value;
        double lat2 = other.Latitude!.Value;
        double lng2 = other.Longitude!.Value;

        const double R = 6371000;

        double lat1Rad = lat1 * Math.PI / 180.0;
        double lat2Rad = lat2 * Math.PI / 180.0;
        double deltaLat = (lat2 - lat1) * Math.PI / 180.0;
        double deltaLng = (lng2 - lng1) * Math.PI / 180.0;


        double a =
            Math.Sin(deltaLat / 2) * Math.Sin(deltaLat / 2) +
            Math.Cos(lat1Rad) * Math.Cos(lat2Rad) *
            Math.Sin(deltaLng / 2) * Math.Sin(deltaLng / 2);

        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return R * c;
    }
}