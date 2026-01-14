using Application.Chat.Messages;
using Domain.LoanTransactions;

namespace Application.Services;

public interface IChatService
{
    Task SendLoanStatusUpdateAsync(Guid currentUserId, string conversationId, LoanTransaction loanTransaction);
    Task SendMessageToConversationAsync(Guid userId, MessageDto messageDto);
    Task UpdateInboxAsync(Guid receiverUserId);
}
