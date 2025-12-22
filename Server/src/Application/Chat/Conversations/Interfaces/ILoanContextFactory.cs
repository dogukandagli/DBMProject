using Application.Chat.Conversations.Queries.GetConversationDetail;
using Domain.LoanTransactions;

namespace Application.Chat.Conversations.Interfaces;


public interface ILoanContextFactory
{
    LoanContextDto Create(LoanTransaction tx, Guid currentUserId);
}
