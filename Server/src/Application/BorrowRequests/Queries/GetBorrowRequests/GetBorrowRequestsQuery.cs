using Application.BorrowRequests.Interfaces;
using Application.BorrowRequests.Queries.DTOs;
using Application.Common;
using Application.Services;
using Domain.BorrowRequests.Repositories;
using MediatR;
using TS.Result;

namespace Application.BorrowRequests.Queries.GetBorrowRequests;

public sealed record GetBorrowRequestsQuery(
    int Page,
    int PageSize) : IRequest<Result<PagedResult<BorrowRequestDto>>>;

internal sealed class GetBorrowRequestsQueryHandler(
    IClaimContext claimContext,
    IBorrowRequestRepository borrowRequestRepository,
    IBorrowRequestsReadService borrowRequestsReadService) : IRequestHandler<GetBorrowRequestsQuery, Result<PagedResult<BorrowRequestDto>>>
{
    public async Task<Result<PagedResult<BorrowRequestDto>>> Handle(GetBorrowRequestsQuery request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();
        int currentNeighborhoodId = claimContext.GetNeighborhoodId();

        BorrowRequestsByNeighborhoodSpecification borrowRequestsByNeighborhoodSpecification = new(currentNeighborhoodId);

        int totalCount = await borrowRequestRepository.CountAsync(borrowRequestsByNeighborhoodSpecification, cancellationToken);

        borrowRequestsByNeighborhoodSpecification
            .ApplyPaging(request.Page, request.PageSize);

        List<BorrowRequestDto> items = await borrowRequestsReadService.GetBorrowRequestsAsync(
            borrowRequestsByNeighborhoodSpecification,
            currentUserId,
            cancellationToken
            );

        PagedResult<BorrowRequestDto> pagedResult = new(
            items,
            request.Page,
            request.PageSize,
            totalCount,
            (int)Math.Ceiling(totalCount / (double)request.PageSize));

        return pagedResult;
    }
}