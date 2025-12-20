using Ardalis.Specification;

namespace Domain.LoanTransactions.Specifications;

public class LoanWithQrCodeByHashTokenSpec : SingleResultSpecification<LoanTransaction>
{
    public LoanWithQrCodeByHashTokenSpec(string HashToken)
    {
        Query
            .Where(l => l.QrTokens.Any(q => q.TokenHash == HashToken))
            .Include(l => l.QrTokens.Where(q => q.TokenHash == HashToken));
    }
}
