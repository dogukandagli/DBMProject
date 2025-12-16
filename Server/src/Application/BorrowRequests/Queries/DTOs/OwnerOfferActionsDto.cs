namespace Application.BorrowRequests.Queries.DTOs;

public sealed record OwnerOfferActionsDto(
    bool CanAccept,
    bool CanReject);
