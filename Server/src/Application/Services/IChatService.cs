using Domain.LoanTransactions;

namespace Application.Services;

public interface IChatService
{
    Task SendLoanStatusUpdateAsync(Guid currentUserId, string conversationId, LoanTransaction loanTransaction);
}
