using Domain.Users.ValueObjects;
using Microsoft.AspNetCore.Identity;

namespace Domain.Users;

public sealed class AppUser : IdentityUser<Guid>
{
    private AppUser() { }

    public AppUser(string email, FirstName firstName, LastName lastName, int neighborhoodId)
    {
        Id = Guid.CreateVersion7();
        TwoFactorEnabled = true;
        Email = email;
        UserName = email;
        SetFirstName(firstName);
        SetLastName(lastName);
        SetStatus(true);
        SetFullName();
        SetNeighborhood(neighborhoodId);
        CreatedAt = DateTime.UtcNow;
    }

    public FirstName FirstName { get; private set; } = default!;
    public LastName LastName { get; private set; } = default!;
    public FullName FullName { get; private set; } = default!;
    public string? PhotoUrl { get; private set; }
    public string? Biography { get; private set; }
    public int NeighborhoodId { get; private set; }

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

    private void SetNeighborhood(int neighborhoodId)
    {
        if (neighborhoodId <= 0) throw new ArgumentException("Mahalle seçimi zorunludur.");
        NeighborhoodId = neighborhoodId;
    }

    public void MoveToNeighborhood(int newNeighborhoodId)
    {
        if (newNeighborhoodId <= 0)
            throw new ArgumentException("Geçersiz Mahalle ID");
        if (NeighborhoodId == newNeighborhoodId)
            return;

        NeighborhoodId = newNeighborhoodId;
    }

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
    public void SetPhotoUrl(string photoUrl)
    {
        PhotoUrl = photoUrl;
    }
    public void SetBiography(string biography)
    {
        Biography = biography;
    }
}
