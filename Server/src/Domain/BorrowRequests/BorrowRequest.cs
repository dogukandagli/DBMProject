using Domain.Abstractions;
using Domain.BorrowRequests.Enums;
using Domain.BorrowRequests.Events;
using Domain.BorrowRequests.ValueObjects;
using Domain.Shared.ValueObjects;

namespace Domain.BorrowRequests;

public sealed class BorrowRequest : AggregateRoot
{
    public UserId BorrowerId { get; private set; }
    public ItemSpecification ItemNeeded { get; private set; } = default!;
    public TimeSlot NeededDates { get; private set; } = default!;
    public BorrowRequestStatus Status { get; private set; }

    private BorrowRequest() { }

    public static BorrowRequest Create(
        UserId borrowerId,
        ItemSpecification itemNeeded,
        TimeSlot neededDates)
    {
        BorrowRequest borrowRequest = new BorrowRequest
        {
            BorrowerId = borrowerId,
            ItemNeeded = itemNeeded,
            NeededDates = neededDates
        };
        borrowRequest.AddDomainEvent(new BorrowRequestCreatedEvent(
            borrowRequest.Id,
            borrowerId,
            itemNeeded,
            neededDates,
            DateTime.UtcNow));

        return borrowRequest;
    }

}
