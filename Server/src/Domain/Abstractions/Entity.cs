namespace Domain.Abstractions;

public abstract class Entity
{
    public Guid Id { get; private set; }

    protected Entity()
    {
        Id = Guid.CreateVersion7();
    }
}



