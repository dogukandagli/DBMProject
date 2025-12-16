using Domain.BorrowRequests.Enums;

namespace Application.BorrowRequests.Queries.DTOs;

public sealed record OfferDto(
    Guid Id,
    List<string> ItemImageUrls,
    string Description,
    HandoverMethod HandoverMethod,
    Condition Condition,
    UserSummaryDto Lender,
    OfferStatus Status,
    TimeSlotDto? AvailableDates,
    OwnerOfferActionsDto? Actions,
    OfferSideActionsDto? OfferSideActionsDto,
    DateTimeOffset? AcceptedAt,
    DateTimeOffset CreatedAt);
