using Domain.BorrowRequests.Events;
using Domain.LoanTransactions;
using Domain.LoanTransactions.Repositories;
using Domain.Shared.ValueObjects;
using MediatR;

namespace Application.BorrowRequests.EventHandlers;

internal class OfferAcceptedLoanTransactionHandler(
    ILoanTransactionRepository loanTransactionRepository) : INotificationHandler<OfferAcceptedDomainEvent>
{
    public async Task Handle(OfferAcceptedDomainEvent notification, CancellationToken cancellationToken)
    {
        TimeSlot timeSlot = TimeSlot.Create(DateTimeOffset.UtcNow.AddDays(1), DateTimeOffset.UtcNow.AddDays(2));
        LoanTransaction loanTransaction = LoanTransaction.Create(
            notification.BorrowRequestId,
            notification.BorrowerId,
            notification.LenderId,
            timeSlot
            );
        await loanTransactionRepository.AddAsync(loanTransaction);
    }
}
