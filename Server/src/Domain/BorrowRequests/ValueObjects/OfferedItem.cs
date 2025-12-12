using Domain.Abstractions;
using Domain.BorrowRequests.Enums;

namespace Domain.BorrowRequests.ValueObjects;

public sealed record OfferedItem
{
    public string Description { get; init; } = default!;
    public Condition Condition { get; init; }

    private OfferedItem() { }

    private OfferedItem(string description, Condition condition)
    {
        Description = description; Condition = condition;
    }

    public static OfferedItem Create(string description, Condition condition)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Ürün açıklaması boş olamaz.");

        return new OfferedItem(
            description.Trim(),
            condition);
    }
}
