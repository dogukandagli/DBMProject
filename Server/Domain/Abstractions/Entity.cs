namespace Domain.Abstractions;

public abstract class Entity
{
    protected Entity()
    {
        Id = Guid.CreateVersion7();
        IsActive = true;
    }

    public Guid Id { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public Guid CreatedBy { get; private set; } = default!;
    public DateTimeOffset? UpdatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public bool IsDeleted { get; set; }
    public DateTimeOffset? DeletedAt { get; private set; }
    public Guid? DeletedBy { get; private set; }
}
