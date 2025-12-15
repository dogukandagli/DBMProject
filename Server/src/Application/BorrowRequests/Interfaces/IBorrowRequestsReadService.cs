using Application.BorrowRequests.Queries.DTOs;
using Ardalis.Specification;
using Domain.BorrowRequests;

namespace Application.BorrowRequests.Interfaces;

public interface IBorrowRequestsReadService
{
    Task<List<BorrowRequestDto>> GetBorrowRequestsAsync(
      ISpecification<BorrowRequest> specification,
       Guid currentUserId,
      CancellationToken cancellationToken = default);

    Task<BorrowRequestDetailDto?> GetBorrowRequestDetailAsync(
        Guid BorrowRequestId,
        Guid currentUserId,
        CancellationToken cancellationToken = default);
}
