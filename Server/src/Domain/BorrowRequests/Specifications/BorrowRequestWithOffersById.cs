using Ardalis.Specification;

namespace Domain.BorrowRequests.Specifications;

public sealed class BorrowRequestWithOffersById : SingleResultSpecification<BorrowRequest>
{
    public BorrowRequestWithOffersById(Guid BorrowRequestId)
    {
        Query
            .Where(b => b.Id == BorrowRequestId)
            .Include(b => b.Offers);
    }
}
