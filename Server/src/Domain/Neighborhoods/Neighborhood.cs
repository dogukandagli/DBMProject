namespace Domain.Neighborhoods;

public class Neighborhood
{
    public int Id { get; private set; }
    public string Name { get; private set; } = default!;
    public int DistrictId { get; private set; }
    private Neighborhood() { }

    public Neighborhood(int id, string Name, int DistrictId)
    {
        SetName(Name);
        SetDistrictId(DistrictId);
    }
    public void SetName(string name)
    {
        if (string.IsNullOrEmpty(name))
            throw new ArgumentException("Şehir adı boş olamaz.");
        Name = name;
    }
    public void SetDistrictId(int districtId)
    {
        DistrictId = districtId;
    }
}
