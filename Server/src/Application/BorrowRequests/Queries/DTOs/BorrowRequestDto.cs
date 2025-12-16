using Domain.BorrowRequests.Enums;

namespace Application.BorrowRequests.Queries.DTOs;


public sealed record BorrowRequestDto(
    Guid Id,
    UserSummaryDto Borrower,
    ItemSpecificationDto ItemNeeded,
    TimeSlotDto NeededDates,
    BorrowRequestStatus BorrowRequestStatus,
    DateTimeOffset CreatedAt,
    int offerCount,
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

public sealed record OfferSummaryDto(
    Guid Id,
    string Description,
    Condition Condition,
    HandoverMethod HandoverMethod,
    OfferStatus OfferStatus,
    TimeSlotDto? AvailableDateDto
    );
