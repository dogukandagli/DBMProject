using Domain.Abstractions;
using Domain.BorrowRequests.ValueObjects;
using Domain.Shared.ValueObjects;

namespace Domain.BorrowRequests.Events;

public sealed class BorrowRequestCreatedEvent : DomainEvent
{
    public Guid BorrowRequestId { get; }
    public UserId BorrowerId { get; }
    public ItemSpecification ItemNeeded { get; }
    public TimeSlot TimeSlot { get; }

    public BorrowRequestCreatedEvent(
            Guid borrowRequestId,
            UserId borrowerId,
            ItemSpecification itemNeeded,
            TimeSlot timeSlot,
            DateTimeOffset occurredOn)
    {
        BorrowRequestId = borrowRequestId;
        BorrowerId = borrowerId;
        ItemNeeded = itemNeeded;
        TimeSlot = timeSlot;
        OccurredOn = occurredOn;
    }
}
