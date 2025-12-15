using Application.BorrowRequests.Interfaces;
using Application.BorrowRequests.Queries.DTOs;
using Application.Services;
using MediatR;
using TS.Result;

namespace Application.BorrowRequests.Queries.GetBorrowRequestDetail;

public sealed record GetBorrowRequestDetailQuery(
    Guid BorrowRequestId) : IRequest<Result<BorrowRequestDetailDto>>;

internal sealed class GetBorrowRequestDetailQueryHandler(
    IClaimContext claimContext,
    IBorrowRequestsReadService borrowRequestsReadService
    ) : IRequestHandler<GetBorrowRequestDetailQuery, Result<BorrowRequestDetailDto>>
{
    public async Task<Result<BorrowRequestDetailDto>> Handle(GetBorrowRequestDetailQuery request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        BorrowRequestDetailDto? borrowRequest = await borrowRequestsReadService
             .GetBorrowRequestDetailAsync(request.BorrowRequestId, currentUserId, cancellationToken);

        if (borrowRequest is null)
            return Result<BorrowRequestDetailDto>.Failure("Ödünç isteği bulunamadı");

        if (borrowRequest.Borrower.Id != currentUserId)
            return Result<BorrowRequestDetailDto>.Failure("Yetkisiz işlem.");

        return borrowRequest;
    }
}