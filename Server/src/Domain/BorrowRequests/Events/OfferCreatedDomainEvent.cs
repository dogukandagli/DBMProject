using Domain.Abstractions;

namespace Domain.BorrowRequests.Events;

public sealed class OfferCreatedDomainEvent : DomainEvent
{
    public Guid BorrowRequestId { get; }
    public Guid BorrowerId { get; }
    public Guid LenderId { get; }

    public OfferCreatedDomainEvent(
        Guid borrowRequestId,
        Guid borrowerId,
        Guid lenderId)
    {
        BorrowRequestId = borrowRequestId;
        BorrowerId = borrowerId;
        LenderId = lenderId;
    }
}
