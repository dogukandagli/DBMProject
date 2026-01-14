using Application.Chat.Conversations.Interfaces;
using Application.Chat.Conversations.Queries.GetConversationDetail;
using Application.Chat.Messages;
using Application.Services;
using Domain.LoanTransactions;
using Infrastructure.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR.Services;

public sealed class SignalRChatHubService(
    IHubContext<ChatHub> hubContext,
    ILoanContextFactory loanContextFactory) : IChatService
{
    public async Task SendLoanStatusUpdateAsync(Guid currentUserId, string conservationId, LoanTransaction loanTransaction)
    {
        LoanContextDto loanContextDto = loanContextFactory.Create(loanTransaction, currentUserId);

        await hubContext.Clients.Group(conservationId)
            .SendAsync("ReceiveLoanStateUpdate", conservationId, loanContextDto);
    }

    public async Task SendMessageToConversationAsync(Guid userId, MessageDto messageDto)
    {
        await hubContext.Clients.Group(userId.ToString())
            .SendAsync("ReceiveMessage", messageDto);
    }

    public async Task UpdateInboxAsync(Guid receiverUserId)
    {
        await hubContext.Clients.Group(receiverUserId.ToString())
            .SendAsync("UpdateInbox");
    }
}