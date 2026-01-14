using Domain.Abstractions;
using Domain.Conversations.Enums;
using Domain.Conversations.Events;

namespace Domain.Conversations;

public sealed class Message : AggregateRoot
{
    public Guid ConversationId { get; private set; }
    public Guid? SenderId { get; private set; }
    public string Content { get; private set; } = default!;
    public MessageType Type { get; private set; }
    public DateTimeOffset? ReadAt { get; private set; }

    private Message() { }
    private Message(Guid conversationId, Guid? senderId, string content, MessageType type)
    {
        ConversationId = conversationId;
        SenderId = senderId;
        Content = content;
        Type = type;
    }
    public static Message CreateUserMessage(Guid conversationId, Guid senderId, string content)
    {
        Message message = new(
            conversationId,
            senderId,
            content.Trim(),
            MessageType.User
            );
        message.AddDomainEvent(new MessageCreatedDomainEvent(message));

        return message;
    }

    public static Message CreateSystemMessage(Guid conversationId, string content)
    {
        return new(
            conversationId,
            null,
            content,
            MessageType.System);
    }
    public void MarkRead(DateTimeOffset utcNow)
    {
        ReadAt ??= utcNow;
    }
}
