using Domain.Abstractions;
using Domain.LoanTransactions.Enums;
using Domain.Shared.ValueObjects;

namespace Domain.LoanTransactions;

public sealed class LoanTransaction : AggregateRoot
{
    public Guid BorrowRequestId { get; private set; }
    public Guid BorrowerId { get; private set; }
    public Guid LenderId { get; private set; }
    public TransactionStatus Status { get; private set; }
    public TimeSlot LoanPeriod { get; private set; } = default!;

    public DateTimeOffset? PickupCompletedAt { get; private set; }
    public Geolocation PickupLocation { get; private set; } = Geolocation.Empty;

    public DateTimeOffset? ReturnCompletedAt { get; private set; }
    public Geolocation ReturnLocation { get; private set; } = Geolocation.Empty;

    private LoanTransaction() { }
    public static LoanTransaction Create(
        Guid borrowRequestId,
        Guid borrowerId,
        Guid lenderId,
        TimeSlot loanPeriod)
    {
        if (borrowRequestId == Guid.Empty) throw new DomainException(nameof(borrowRequestId));
        if (borrowerId == Guid.Empty) throw new DomainException(nameof(borrowerId));
        if (lenderId == Guid.Empty) throw new DomainException(nameof(lenderId));
        if (borrowerId == lenderId) throw new DomainException("Borrower and lender cannot be the same.");
        if (loanPeriod.Start >= loanPeriod.End) throw new DomainException("LoanPeriod is invalid.");

        return new LoanTransaction
        {
            BorrowRequestId = borrowRequestId,
            BorrowerId = borrowerId,
            LenderId = lenderId,
            LoanPeriod = loanPeriod,
            Status = TransactionStatus.PendingPickup
        };
    }
}
