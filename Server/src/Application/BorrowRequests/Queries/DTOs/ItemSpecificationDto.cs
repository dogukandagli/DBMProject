namespace Application.BorrowRequests.Queries.DTOs;

public sealed record ItemSpecificationDto(
    string Title,
    string Description,
    string Category,
    string? ImageUrl
    );
