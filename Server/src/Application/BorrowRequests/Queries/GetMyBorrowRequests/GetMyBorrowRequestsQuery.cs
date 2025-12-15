using Application.BorrowRequests.Interfaces;
using Application.BorrowRequests.Queries.DTOs;
using Application.Common;
using Application.Services;
using Domain.BorrowRequests.Repositories;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.BorrowRequests.Queries.GetMyBorrowRequests;

public sealed record GetMyBorrowRequestsQuery(
    int Page,
    int PageSize) : IRequest<Result<PagedResult<BorrowRequestDto>>>;

internal sealed class GetMyBorrowRequestsQueryHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager,
    IBorrowRequestRepository borrowRequestRepository,
    IBorrowRequestsReadService borrowRequestsReadService) : IRequestHandler<GetMyBorrowRequestsQuery, Result<PagedResult<BorrowRequestDto>>>
{
    public async Task<Result<PagedResult<BorrowRequestDto>>> Handle(GetMyBorrowRequestsQuery request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();
        AppUser? appUser = await userManager.FindByIdAsync(currentUserId.ToString());
        if (appUser is null)
            return Result<PagedResult<BorrowRequestDto>>.Failure("Kullanıcı bulunamadı.");

        BorrowRequestsByUserIdSpecification borrowRequestsByUserIdSpecification = new(appUser.Id);

        int totalCount = await borrowRequestRepository.CountAsync(borrowRequestsByUserIdSpecification, cancellationToken);

        borrowRequestsByUserIdSpecification.ApplyPaging(request.Page, request.PageSize);

        List<BorrowRequestDto> items = await borrowRequestsReadService.GetBorrowRequestsAsync(
           borrowRequestsByUserIdSpecification,
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