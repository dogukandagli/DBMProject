namespace Domain.BorrowRequests.ValueObjects;

public sealed record ItemSpecification
{
    public string Title { get; init; } = default!;
    public string Description { get; init; } = default!;
    public string Category { get; init; } = default!;
    public string? ImageUrl { get; init; }

    private ItemSpecification(string title, string description, string category, string? imageUrl)
    {
        Title = title;
        Description = description;
        Category = category;
        ImageUrl = imageUrl;
    }

    public static ItemSpecification Create(string title, string description, string category, string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Ürün adı boş bırakılamaz.");

        if (title.Trim().Length < 3)
            throw new ArgumentException("Ürün adı en az 3 karakter olmalıdır.");

        if (string.IsNullOrWhiteSpace(category))
            throw new ArgumentException("Kategori seçimi zorunludur.");
        if (description.Length > 500)
            throw new ArgumentException("Açıklama 500 karakterden uzun olamaz.");

        return new ItemSpecification(title.Trim(), description.Trim() ?? "", category, imageUrl);
    }
    public bool HasImage()
    {
        return !string.IsNullOrEmpty(ImageUrl);
    }

}
