namespace Application.Common;

public sealed class CursorPaginatedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public DateTimeOffset? NextCursor { get; set; }
    public bool HasMore { get; set; }
}
