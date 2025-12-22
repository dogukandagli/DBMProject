namespace Domain.LoanTransactions.Specifications;

using Ardalis.Specification;

public sealed class LoanTransactionByIdReadOnlySpec
    : SingleResultSpecification<LoanTransaction>
{
    public LoanTransactionByIdReadOnlySpec(Guid id)
    {
        Query
            .Where(x => x.Id == id)
            .AsNoTracking(); // 🔑 sadece bu entity için
    }
}

