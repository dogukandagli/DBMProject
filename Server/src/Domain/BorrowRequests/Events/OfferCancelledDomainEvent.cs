using Domain.Abstractions;

namespace Domain.BorrowRequests.Events;


public sealed class OfferCancelledDomainEvent : DomainEvent
{

    public Guid BorrowRequestId { get; }
    public Guid RejectedOfferId { get; }
    public OfferCancelledDomainEvent(Guid borrowRequestId,
        Guid rejectedOfferId)
    {
        BorrowRequestId = borrowRequestId;
        RejectedOfferId = rejectedOfferId;
    }
}
