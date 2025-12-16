using Application.BorrowRequests.Interfaces;
using Application.BorrowRequests.Queries.DTOs;
using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Enums;
using Domain.Users;
using Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.QueryServices;

public sealed class BorrowRequestsReadService(
    ApplicationDbContext context,
    UserManager<AppUser> userManager) : IBorrowRequestsReadService
{
    public async Task<BorrowRequestDetailDto?> GetBorrowRequestDetailAsync(
        Guid BorrowRequestId, Guid currentUserId, CancellationToken cancellationToken = default)
    {
        var query = from br in context.BorrowRequest.AsNoTracking()
                    join borrower in userManager.Users on br.BorrowerId equals borrower.Id
                    where br.Id == BorrowRequestId
                    let isOwnerRequest = br.BorrowerId == currentUserId
                    let hasAcceptedOffer = br.Offers.Any(o => o.Status == OfferStatus.Accepted)
                    let isOpen = br.Status == BorrowRequestStatus.Open
                    let isCancelled = br.Status == BorrowRequestStatus.Cancelled
                    select new BorrowRequestDetailDto(
                         br.Id,
                         br.NeighborhoodId,
                         br.Status,
                         new UserSummaryDto(borrower.Id,
                         borrower.FullName,
                         borrower.ProfilePhotoUrl
                             ),
                         new ItemSpecificationDto(br.ItemNeeded.Title,
                         br.ItemNeeded.Description,
                         br.ItemNeeded.Category,
                         br.ItemNeeded.ImageUrl)
                         , new(br.NeededDates.Start,
                         br.NeededDates.End),
                         new RequestActionsDto(
                            isOwnerRequest && isOpen && !br.Offers.Any(),
                            isOwnerRequest && isOpen && !hasAcceptedOffer,
                             isOwnerRequest && isOpen && !br.Offers.Any(),
                            isOwnerRequest && isCancelled
                             )
                         , br.CreatedAt,
                         (from o in context.Offer
                          join lender in userManager.Users on o.LenderId equals lender.Id
                          where o.BorrowRequestId == br.Id
                          let isOwnerOffer = o.LenderId == currentUserId
                          let isPendingOffer = o.Status == OfferStatus.Pending
                          select new OfferDto(
                              o.Id,
                              o.PhotoUrls
                                .OrderBy(p => p.SortOrder)
                                .Select(p => p.Url)
                                .ToList(),
                              o.OfferedItem.Description,
                              o.HandoverMethod,
                              o.OfferedItem.Condition,
                              new UserSummaryDto(lender.Id,
                              lender.FullName,
                              lender.ProfilePhotoUrl),
                              o.Status,
                             o.AvailableTimeSlot != null
                                ? new TimeSlotDto(o.AvailableTimeSlot.Start, o.AvailableTimeSlot.End)
                                : null,
                              new OfferActionsDto(isOwnerRequest && isPendingOffer && isOpen,
                              isOwnerRequest && isPendingOffer && isOpen),
                              o.AcceptedAt
                              )).ToList()
                        );
        return await query.FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<BorrowRequestDto>> GetBorrowRequestsAsync(ISpecification<BorrowRequest> specification, Guid currentUserId, CancellationToken cancellationToken = default)
    {
        var borrowRequestQuery = SpecificationEvaluator.Default
            .GetQuery(context.BorrowRequest.AsQueryable(), specification);

        var query = from borrowRequest in borrowRequestQuery
                    join user in userManager.Users on borrowRequest.BorrowerId equals user.Id
                    join offer in context.Offer.Where(x => x.LenderId == currentUserId)
                        on borrowRequest.Id equals offer.BorrowRequestId into offersForThisUser
                    let isOwner = borrowRequest.BorrowerId == currentUserId
                    let hasOffered = offersForThisUser.Any()
                    select new BorrowRequestDto(
                        borrowRequest.Id,
                        new UserSummaryDto(
                            user.Id,
                            user.FullName,
                            user.ProfilePhotoUrl
                            ),
                        new ItemSpecificationDto(
                            borrowRequest.ItemNeeded.Title,
                            borrowRequest.ItemNeeded.Description,
                            borrowRequest.ItemNeeded.Category,
                            borrowRequest.ItemNeeded.ImageUrl),
                        new TimeSlotDto(
                            borrowRequest.NeededDates.Start,
                            borrowRequest.NeededDates.End),
                        borrowRequest.Status,
                        borrowRequest.CreatedAt,
                        isOwner ? borrowRequest.Offers.Count() : 0,
                        null,
                        new BorrowRequestActionsDto(
                            isOwner,
                            isOwner,
                            !isOwner && !hasOffered,
                            isOwner,
                            hasOffered,
                            isOwner,
                            !isOwner,
                            !isOwner
                            ));

        return await query.ToListAsync(cancellationToken);
    }

}
