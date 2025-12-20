namespace Application.Events.Queries.GetEvents;

public sealed record EventDto(
    Guid EventId,
    string Title,
    string? CoverPhotoUrl,
    string FormattedAddress,
    DateTimeOffset StartTime,
    DateTimeOffset? EndTime,
    DateTimeOffset CreatedAt,
    int? Capacity,
    int CurrentCount,
    decimal? Price,
    string? Description,
    UserDto UserDto,
    EventActions EventActions,
    EventOwnerActions EventOwnerActions
    );


public sealed record UserDto(
    Guid UserId,
    string FullName,
    string? ProfilePhotoUrl,
    bool IsOwner
    );


public sealed record EventActions(
    bool CanJoin,
    bool CanLeave
    );

public sealed record EventOwnerActions(
    bool CanDelete,
    bool CanEdit,
    bool CanCancel
    );
