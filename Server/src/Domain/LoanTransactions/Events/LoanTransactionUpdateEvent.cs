using Domain.Abstractions;

namespace Domain.LoanTransactions.Events;

public sealed class LoanTransactionUpdateEvent : DomainEvent
{
    public Guid TransactionId { get; }
    public LoanTransactionUpdateEvent(Guid transactionId)
    {
        TransactionId = transactionId;
    }
}
