using Domain.Conversations;
using Domain.Conversations.Repositories;
using Domain.Conversations.Repositorues;
using Domain.LoanTransactions.Events;
using MediatR;

namespace Application.LoanTransactions.EventHandlers;

internal sealed class LoanTransactionCreatedConversationHandler(
    IConversationRepository conversationRepository,
    IMessageRepository messageRepository) : INotificationHandler<LoanTransactionCreatedEvent>
{
    public async Task Handle(LoanTransactionCreatedEvent notification, CancellationToken cancellationToken)
    {
        Conversation loanConversation = Conversation.CreateForLoan(
            notification.LoanTransactionId,
            notification.BorrowerId,
            notification.LenderId);

        string systemText = $"İşleminiz başlamıştır.";

        Message systemMessage = Message.CreateSystemMessage(loanConversation.Id, systemText);

        loanConversation.UpdateLastMessage("İşleminiz başlatıldı.", systemMessage.CreatedAt);

        await conversationRepository.AddAsync(loanConversation, cancellationToken);
        await messageRepository.AddAsync(systemMessage, cancellationToken);
    }
}