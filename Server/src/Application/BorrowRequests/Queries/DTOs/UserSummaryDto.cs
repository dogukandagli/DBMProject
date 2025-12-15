namespace Application.BorrowRequests.Queries.DTOs;

public sealed record UserSummaryDto(
    Guid Id,
    string FullName,
    string? ProfileImageUrl
   );
