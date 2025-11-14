namespace Domain.Neighborhoods;

public class District
{
    private District() { }

    public District(int id, string Name, int CityId)
    {
        SetName(Name);
        SetCityId(CityId);
    }

    public int Id { get; private set; }
    public string Name { get; private set; } = default!;
    public int CityId { get; private set; }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("İlçe adı boş olamaz.");
        Name = name;
    }
    public void SetCityId(int cityId)
    {
        if (cityId <= 0 || cityId > 81)
            throw new ArgumentException("Geçersiz CityId.");
        CityId = cityId;
    }
}
