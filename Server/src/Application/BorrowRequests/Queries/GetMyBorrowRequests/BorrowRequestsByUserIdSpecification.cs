using Application.Common;
using Ardalis.Specification;
using Domain.BorrowRequests;

namespace Application.BorrowRequests.Queries.GetMyBorrowRequests;

public sealed class BorrowRequestsByUserIdSpecification : FeedBaseSpecification<BorrowRequest>
{
    public BorrowRequestsByUserIdSpecification(Guid userId)
    {
        Query
            .Where(b => b.BorrowerId == userId)
            .OrderByDescending(b => b.CreatedAt);
    }
}
