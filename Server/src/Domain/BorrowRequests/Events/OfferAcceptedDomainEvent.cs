using Domain.Abstractions;

namespace Domain.BorrowRequests.Events;

public sealed class OfferAcceptedDomainEvent : DomainEvent
{

    public Guid BorrowRequestId { get; }
    public Guid BorrowerId { get; }
    public Guid LenderId { get; }
    public Guid AcceptedOfferId { get; }
    public string ItemTitle { get; } = default!;
    public OfferAcceptedDomainEvent(Guid borrowRequestId,
        Guid borrowerId,
        Guid lenderId,
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
