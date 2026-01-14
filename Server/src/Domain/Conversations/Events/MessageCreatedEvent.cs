using Domain.Abstractions;

namespace Domain.Conversations.Events;

public sealed class MessageCreatedDomainEvent : DomainEvent
{
    public Message Message { get; }
    public MessageCreatedDomainEvent(Message message)
    {
        Message = message;
    }
}