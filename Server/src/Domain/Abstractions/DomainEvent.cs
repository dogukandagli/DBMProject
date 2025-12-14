using MediatR;

namespace Domain.Abstractions;

public abstract class DomainEvent : INotification
{
    public DateTimeOffset OccurredOn { get; protected set; }
}
