namespace Domain.LoanTransactions.Enums;

public enum TransactionStatus
{
    PendingPickup = 1,
    Active = 2,
    PendingReturn = 3,
    Completed = 4,
    Cancelled = 5,
    Disputed = 6
}
