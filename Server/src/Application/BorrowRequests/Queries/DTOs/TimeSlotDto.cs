namespace Application.BorrowRequests.Queries.DTOs;

public sealed record TimeSlotDto(
    DateTimeOffset StartDate,
    DateTimeOffset EndDate);
