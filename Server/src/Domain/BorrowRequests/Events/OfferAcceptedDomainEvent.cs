using Domain.Abstractions;
using Domain.Shared.ValueObjects;

namespace Domain.BorrowRequests.Events;

public sealed class OfferAcceptedDomainEvent : DomainEvent
{

    public Guid BorrowRequestId { get; }
    public UserId BorrowerId { get; }
    public UserId LenderId { get; }
    public Guid AcceptedOfferId { get; }
    public string ItemTitle { get; } = default!;
    public OfferAcceptedDomainEvent(Guid borrowRequestId,
        UserId borrowerId,
        UserId lenderId,
        Guid acceptedOfferId,
        string itemTitle)
    {
        BorrowRequestId = borrowRequestId;
        BorrowerId = borrowerId;
        LenderId = lenderId;
        AcceptedOfferId = acceptedOfferId;
        ItemTitle = itemTitle;
    }
}
