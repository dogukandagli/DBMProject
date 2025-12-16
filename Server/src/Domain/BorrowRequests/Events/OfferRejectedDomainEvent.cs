using Domain.Abstractions;

namespace Domain.BorrowRequests.Events;

public sealed class OfferRejectedDomainEvent : DomainEvent
{

    public Guid BorrowRequestId { get; }
    public Guid RejectedOfferId { get; }
    public OfferRejectedDomainEvent(Guid borrowRequestId,
        Guid rejectedOfferId)
    {
        BorrowRequestId = borrowRequestId;
        RejectedOfferId = rejectedOfferId;
    }
}
