using Application.Chat.Conversations.Interfaces;
using Application.Chat.Conversations.Queries.GetConversationDetail;
using Domain.LoanTransactions;
using Domain.LoanTransactions.Enums;

namespace Application.Chat.Conversations.Services;

public sealed class LoanContextFactory : ILoanContextFactory
{
    public LoanContextDto Create(LoanTransaction tx, Guid currentUserId)
    {
        var role = DetermineRole(tx, currentUserId);
        var requiredAction = DetermineGlobalAction(tx.Status);

        return new LoanContextDto
        {
            LoanTransactionId = tx.Id,
            TransactionStatus = tx.Status.ToString(),
            LoanPeriodStart = tx.LoanPeriod.Start,
            LoanPeriodEnd = tx.LoanPeriod.End,
            BorrowerId = tx.BorrowerId,
            LenderId = tx.LenderId,
            ActorRole = role,
            QrMode = QrMode.None,
            RequiredAction = requiredAction
        };
    }

    private static ActorRole DetermineRole(LoanTransaction tx, Guid currentUserId)
        => currentUserId == tx.LenderId ? ActorRole.Lender
         : currentUserId == tx.BorrowerId ? ActorRole.Borrower
         : ActorRole.Viewer;

    public static RequiredAction DetermineGlobalAction(TransactionStatus status)
    {
        switch (status)
        {
            case TransactionStatus.Created:
            case TransactionStatus.PendingPickup:
                return RequiredAction.LenderGeneratePickupQr;

            case TransactionStatus.Active:
            case TransactionStatus.PendingReturn:
                return RequiredAction.BorrowerGenerateReturnQr;

            case TransactionStatus.Completed:
            default:
                return RequiredAction.None;
        }
    }
}
