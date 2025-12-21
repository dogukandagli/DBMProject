using Domain.Abstractions;

namespace Domain.Conversations.Events;

public sealed class MessageCreatedEvent : DomainEvent
{
    public Guid? SenderId { get; }
    public Guid ConversationId { get; }

    public MessageCreatedEvent(Guid? senderId, Guid conversationId)
    {
        SenderId = senderId;
        ConversationId = conversationId;
    }
}
