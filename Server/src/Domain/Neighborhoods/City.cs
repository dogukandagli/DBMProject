namespace Domain.Neighborhoods;

public class City
{
    private City() { }

    public City(int id, string name)
    {
        SetId(id);
        SetName(name);

    }
    public int Id { get; private set; } //plaka kodu da olabilir
    public string Name { get; private set; } = default!;

    public void SetId(int id)
    {
        if (id <= 0 || id > 81)
            throw new ArgumentException("Geçersiz plaka kodu.");
        Id = id;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrEmpty(name))
            throw new ArgumentException("Şehir adı boş olamaz.");
        Name = name;
    }
}
