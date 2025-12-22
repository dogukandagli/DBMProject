namespace Domain.LoanTransactions.Enums;

public enum TransactionStatus
{
    Created = 1,
    PendingPickup = 2,
    Active = 3,
    PendingReturn = 4,
    Completed = 6,
    Cancelled = 6,
    Disputed = 7
}
