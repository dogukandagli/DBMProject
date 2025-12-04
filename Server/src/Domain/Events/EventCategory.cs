using Domain.Abstractions;

namespace Domain.Events;

public sealed class EventCategory : AuditableEntity
{

    public string Name { get; private set; } = default!;
    private EventCategory() { }
    public EventCategory( string name)
    {
        Name = name;
    }
    public void UpdateName(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName)) throw new ArgumentNullException(nameof(newName));
        Name = newName;
    }

}
