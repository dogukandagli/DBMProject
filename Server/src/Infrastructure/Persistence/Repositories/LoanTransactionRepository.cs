using Ardalis.Specification.EntityFrameworkCore;
using Domain.LoanTransactions;
using Domain.LoanTransactions.Repositories;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

internal class LoanTransactionRepository : RepositoryBase<LoanTransaction>, ILoanTransactionRepository
{
    public LoanTransactionRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
