using Domain.Abstractions;

namespace Domain.Shared.ValueObjects;


public record Photo
{
    public string Url { get; init; } = default!;
    public bool IsMain { get; init; }
    public int SortOrder { get; init; }

    private Photo() { }

    private Photo(string url, bool isMain, int sortOrder)
    {
        Url = url;
        IsMain = isMain;
        SortOrder = sortOrder;
    }

    public static Photo Create(string url, bool isMain = false, int sortOrder = 0)
    {
        if (string.IsNullOrWhiteSpace(url))
            throw new DomainException("Fotoğraf linki boş olamaz.");

        return new Photo(url.Trim(), isMain, sortOrder);
    }
}
