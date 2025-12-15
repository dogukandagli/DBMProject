using Ardalis.Specification;
using Domain.BorrowRequests;

namespace Application.BorrowRequests.Queries.GetBorrowRequestDetail;

public sealed class BorrowRequestDetailSpecification : SingleResultSpecification<BorrowRequest>
{
    public BorrowRequestDetailSpecification(Guid BorrowRequestId)
    {
        Query
            .Where(b => b.Id == BorrowRequestId)
            .Include(b => b.Offers.OrderByDescending(o => o.CreatedAt));
    }
}
