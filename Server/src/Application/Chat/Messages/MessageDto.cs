namespace Application.Chat.Messages;

public sealed record MessageDto(
    Guid Id,
    Guid ConversationId,
    Guid SenderId,
    string SenderName,
    string? SenderAvatar,
    string Content,
    string MessageType,
    DateTimeOffset CreatedAt,
    bool IsRead,
    DateTimeOffset? ReadAt,
    bool IsMe);
