using Domain.BorrowRequests.Enums;

namespace Application.BorrowRequests.Queries.DTOs;

public sealed record BorrowRequestDetailDto(
    Guid Id,
    int NeighborhoodId,
    BorrowRequestStatus Status,
    UserSummaryDto Borrower,
     ItemSpecificationDto ItemNeeded,
    TimeSlotDto NeededDates,
    RequestActionsDto Actions,
    DateTimeOffset CreatedAt,
    List<OfferDto> Offers
    );

public sealed record RequestActionsDto(
    bool CanEdit,
    bool CanCancel,
    bool CanDelete,
    bool CanReopen);
