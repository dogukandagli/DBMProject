using Domain.Abstractions;

namespace Domain.LoanTransactions.Events;

public sealed class LoanTransactionCreatedEvent : DomainEvent
{
    public Guid LoanTransactionId { get; }
    public Guid BorrowerId { get; }
    public Guid LenderId { get; }
    public Guid BorrowRequestId { get; }
    public LoanTransactionCreatedEvent(Guid loanTransactionId, Guid borrowerId, Guid lenderId, Guid borrowRequestId)
    {
        LoanTransactionId = loanTransactionId;
        BorrowerId = borrowerId;
        LenderId = lenderId;
        BorrowRequestId = borrowRequestId;
    }
}
