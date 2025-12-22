using Application.Services;
using Domain.Conversations;
using Domain.Conversations.Repositorues;
using Domain.Conversations.Specifications;
using Domain.LoanTransactions;
using Domain.LoanTransactions.Events;
using Domain.LoanTransactions.Repositories;
using Domain.LoanTransactions.Specifications;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.LoanTransactions.EventHandlers;

internal sealed class LoanTransactionUpdateChat(
    ILoanTransactionRepository loanTransactionRepository,
    ILogger<LoanTransactionUpdateChat> logger,
    IChatService chatService,
    IClaimContext claimContext,
    IConversationRepository conversationRepository
    ) : INotificationHandler<LoanTransactionUpdateEvent>
{
    public async Task Handle(LoanTransactionUpdateEvent notification, CancellationToken cancellationToken)
    {
        LoanTransactionByIdReadOnlySpec loanTransactionByIdReadOnlySpec = new(notification.TransactionId);
        LoanTransaction? loanTransaction = await loanTransactionRepository
            .FirstOrDefaultAsync(loanTransactionByIdReadOnlySpec, cancellationToken);

        if (loanTransaction is null)
        {
            logger.LogError("Transaction bulunumadı");
            return;
        }

        ConversationByRelatedEntityIdSpec conversationByRelatedEntityIdSpec = new(loanTransaction.Id);
        Conversation? conversation = await conversationRepository.FirstOrDefaultAsync(conversationByRelatedEntityIdSpec, cancellationToken);
        if (conversation is null)
        {
            logger.LogError("Conversation bulunumadı");
            return;
        }


        Guid currentUserId = claimContext.GetUserId();

        await chatService.SendLoanStatusUpdateAsync(currentUserId, conversation.Id.ToString(), loanTransaction);
    }
}
