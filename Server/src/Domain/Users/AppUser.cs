using Domain.Users.ValueObjects;
using Microsoft.AspNetCore.Identity;

namespace Domain.Users;

public sealed class AppUser : IdentityUser<Guid>
{
    private AppUser() { }

    public AppUser(FirstName firstName, LastName lastName)
    {
        Id = Guid.CreateVersion7();
        TwoFactorEnabled = true;
        SetFirstName(firstName);
        SetLastName(lastName);
        SetStatus(true);
        SetFullName();
        CreatedAt = DateTime.UtcNow;
    }

    public FirstName FirstName { get; set; } = default!;
    public LastName LastName { get; set; } = default!;
    public FullName FullName { get; set; } = default!;

    #region
    public bool IsActive { get; private set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTimeOffset? UpdatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public bool IsDeleted { get; private set; }
    public DateTimeOffset? DeletedAt { get; private set; }
    public Guid? DeletedBy { get; private set; }

    public void SetStatus(bool isActive)
    {
        IsActive = isActive;
    }
    public void Delete()
    {
        IsDeleted = true;
    }

    #endregion

    public void SetFirstName(FirstName firstName)
    {
        FirstName = firstName;
    }

    public void SetLastName(LastName lastName)
    {
        LastName = lastName;
    }
    public void SetFullName()
    {
        FullName = new(FirstName.Value + " " + LastName.Value);
    }


}
