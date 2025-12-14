using Application.BorrowRequests.Queries.GetBorrowRequests;
using Ardalis.Specification;
using Domain.BorrowRequests;

namespace Application.BorrowRequests.Interfaces;

public interface IBorrowRequestsReadService
{
    Task<List<BorrowRequestDto>> GetBorrowRequestsAsync(
      ISpecification<BorrowRequest> specification,
      Guid currentUserId,
      CancellationToken cancellationToken = default);

}
