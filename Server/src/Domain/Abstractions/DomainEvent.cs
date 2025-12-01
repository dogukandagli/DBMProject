using MediatR;

namespace Domain.Abstractions;

public abstract class DomainEvent : INotification
{
    public DateTimeOffset Occurredon { get; private set; }
}
