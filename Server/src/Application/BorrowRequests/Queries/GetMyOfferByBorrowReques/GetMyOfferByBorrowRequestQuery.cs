using Application.BorrowRequests.Queries.DTOs;
using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Enums;
using Domain.BorrowRequests.Repositories;
using Domain.BorrowRequests.Specifications;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.BorrowRequests.Queries.GetMyOfferByBorrowReques;

public sealed record GetMyOfferByBorrowRequestQuery(
    Guid BorrowRequestId) : IRequest<Result<OfferDto>>;

internal sealed class GetMyOfferByBorrowRequestQueryHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager,
    IBorrowRequestRepository borrowRequestRepository
    ) : IRequestHandler<GetMyOfferByBorrowRequestQuery, Result<OfferDto>>
{
    public async Task<Result<OfferDto>> Handle(GetMyOfferByBorrowRequestQuery request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();
        AppUser? appUser = await userManager.FindByIdAsync(currentUserId.ToString());
        if (appUser is null)
            return Result<OfferDto>.Failure("Kullanıcı bulunamadı.");

        BorrowRequestWithOffersById borrowRequestWithOffersById = new(request.BorrowRequestId);
        BorrowRequest? borrowRequest = await borrowRequestRepository.FirstOrDefaultAsync(borrowRequestWithOffersById, cancellationToken);
        if (borrowRequest is null)
            return Result<OfferDto>.Failure("Ödünç alma isteği bulunamadı.");

        Offer? offer = borrowRequest.Offers.FirstOrDefault(o => o.LenderId == appUser.Id);
        if (offer is null)
            return Result<OfferDto>.Failure("Teklifiniz bulunamadı.");

        OfferDto offerDto = new(
            offer.Id,
            offer.PhotoUrls
                .OrderBy(p => p.SortOrder)
                .Select(p => p.Url)
                .ToList(),
            offer.OfferedItem.Description,
            offer.HandoverMethod,
            offer.OfferedItem.Condition,
            new UserSummaryDto(appUser.Id, appUser.FullName, appUser.ProfilePhotoUrl)
            , offer.Status,
             offer.AvailableTimeSlot != null
                                ? new TimeSlotDto(offer.AvailableTimeSlot.Start, offer.AvailableTimeSlot.End)
                                : null,
             null,
             new OfferSideActionsDto(offer.Status == OfferStatus.Pending
             && borrowRequest.Status == BorrowRequestStatus.Open,
             offer.Status == OfferStatus.Pending
              && borrowRequest.Status == BorrowRequestStatus.Open),
             offer.AcceptedAt,
             offer.CreatedAt
            );

        return offerDto;
    }
}