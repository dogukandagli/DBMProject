namespace Domain.Abstractions;

public abstract class AuditableEntity : Entity
{
    public bool IsActive { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public Guid CreatedBy { get; private set; } = default!;
    public DateTimeOffset? UpdatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public bool IsDeleted { get; private set; }
    public DateTimeOffset? DeletedAt { get; private set; }
    public Guid? DeletedBy { get; private set; }

    protected AuditableEntity() { }
    public void SetStatus(bool isActive)
    {
        IsActive = isActive;
    }
    public void Delete()
    {
        IsDeleted = true;
    }
}
