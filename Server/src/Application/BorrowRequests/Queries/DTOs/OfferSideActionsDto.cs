namespace Application.BorrowRequests.Queries.DTOs;

public sealed record OfferSideActionsDto(
    bool CanCancel,
    bool CanUpdate
);
