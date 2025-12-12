using Application.Common;
using Ardalis.Specification;
using Domain.BorrowRequests;

namespace Application.BorrowRequests.Queries.GetBorrowRequests;

public sealed class BorrowRequestsByNeighborhoodSpecification : FeedBaseSpecification<BorrowRequest>
{
    public BorrowRequestsByNeighborhoodSpecification(int neighborhoodId)
    {
        Query
            .Where(b => b.NeighborhoodId == neighborhoodId)
            .OrderByDescending(b => b.CreatedAt);
    }
}
