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
        var (qrMode, requiredAction) = DetermineQrState(tx.Status, role);

        return new LoanContextDto
        {
            LoanTransactionId = tx.Id,
            TransactionStatus = tx.Status.ToString(),
            LoanPeriodStart = tx.LoanPeriod.Start,
            LoanPeriodEnd = tx.LoanPeriod.End,
            BorrowerId = tx.BorrowerId,
            LenderId = tx.LenderId,
            ActorRole = role,
            QrMode = qrMode,
            RequiredAction = requiredAction
        };
    }

    private static ActorRole DetermineRole(LoanTransaction tx, Guid currentUserId)
        => currentUserId == tx.LenderId ? ActorRole.Lender
         : currentUserId == tx.BorrowerId ? ActorRole.Borrower
         : ActorRole.Viewer;

    public static (QrMode Mode, RequiredAction Action) DetermineQrState(TransactionStatus status, ActorRole role)
        => (status, role) switch
        {

            (TransactionStatus.Created or TransactionStatus.PendingPickup, ActorRole.Lender) => (QrMode.Generate, RequiredAction.LenderGeneratePickupQr),
            (TransactionStatus.PendingPickup, ActorRole.Borrower) => (QrMode.Scan, RequiredAction.BorrowerScanPickUpQr),

            (TransactionStatus.Active or TransactionStatus.PendingReturn, ActorRole.Borrower) => (QrMode.Generate, RequiredAction.BorrowerGenerateReturnQr),
            (TransactionStatus.PendingReturn, ActorRole.Lender) => (QrMode.Scan, RequiredAction.LenderScanReturnQr),

            _ => (QrMode.None, RequiredAction.None)
        };
}

