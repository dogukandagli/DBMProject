namespace Application.Common.Models;

public sealed class AutocompleteResult
{
    public string Description { get; set; } = string.Empty;
    public string PlaceId { get; set; } = string.Empty;
    public string MainText { get; set; } = string.Empty;
    public string SecondaryText { get; set; } = string.Empty;
    public List<string>? Types { get; set; }
}