using Domain.BorrowRequests.Enums;

namespace Application.BorrowRequests.Queries.GetBorrowRequests;


public sealed record BorrowRequestDto(
    Guid Id,
    UserSummaryDto Borrower,
    ItemSpecificationDto ItemNeeded,
    TimeSlotDto NeededDates,
    BorrowRequestStatus BorrowRequestStatus,
    DateTimeOffset CreatedAt,
    int offerCount,
    OfferSummaryDto? OfferSummaryDto,
    BorrowRequestActionsDto BorrowRequestActionsDto
    );

public sealed record BorrowRequestActionsDto(
    bool CanEdit,
    bool CanCancel,
    bool CanMakeOffer,
    bool CanViewOffers,
    bool HasOffered,
    bool CanAcceptOffer,
    bool CanWithdrawOffer,
    bool CanEditOffer);

public sealed record UserSummaryDto(
    Guid Id,
    string FullName,
    string? ProfileImageUrl
   );

public sealed record ItemSpecificationDto(
    string Title,
    string Description,
    string Category,
    string? ImageUrl
    );

public sealed record OfferSummaryDto(
    Guid Id,
    string Description,
    Condition Condition,
    HandoverMethod HandoverMethod,
    OfferStatus OfferStatus,
    TimeSlotDto? AvailableDateDto
    );

public sealed record TimeSlotDto(
    DateTimeOffset StartDate,
    DateTimeOffset EndDate);
