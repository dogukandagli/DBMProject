using Domain.Abstractions;

namespace Domain.Conversations.Events;

public sealed class ConversationReadEvent : DomainEvent
{
    public ConversationReadEvent(Guid conversationId, Guid readerId, DateTimeOffset readAt)
    {
        ConversationId = conversationId;
        ReaderId = readerId;
        ReadAt = readAt;
    }

    public Guid ConversationId { get; }
    public Guid ReaderId { get; }
    public DateTimeOffset ReadAt { get; }

}