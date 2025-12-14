using Domain.Abstractions;

namespace Domain.BorrowRequests.Events;

public sealed class BorrowRequestCancelledDomainEvent : DomainEvent
{
    public Guid BorrowRequestId { get; }
    public BorrowRequestCancelledDomainEvent(Guid borrowRequestId)
    {
        BorrowRequestId = borrowRequestId;
    }
}
