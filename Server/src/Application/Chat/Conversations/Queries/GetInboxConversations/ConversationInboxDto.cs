using Domain.Conversations.Enums;

namespace Application.Chat.Conversations.Queries.GetInboxConversations;

public sealed record ConversationInboxDto(
    Guid Id,
    string Title,
    string? AvatarUrl,
    ConversationType Type,
    string? LastMessage,
    DateTimeOffset? LastMessageAt,
    Guid? RelatedEntityId,
    bool IsLastMessageFromMe,
    bool IsReadByRecipient,
    bool IsReadByMe
);
