namespace Application.Events.Queries.GetEventParticipants;

public sealed record ParticipantDto
(
    Guid UserId,
    string FullName,
    string? ProfilePhotoUrl,
    DateTimeOffset CreatedAt
);
