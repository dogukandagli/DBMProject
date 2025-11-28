using Domain.Shared;
using Domain.Users.ValueObjects;
using Microsoft.AspNetCore.Identity;

namespace Domain.Users;

public sealed class AppUser : IdentityUser<Guid>
{
    private AppUser() { }

    public AppUser(string email,
        FirstName firstName,
        LastName lastName,
        int neighborhoodId,
        DateOnly birthDate,
        double latitude,
        double longitude,
        string formattedAddress,
        string placeId,
        string streetAddress
        )
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
        SetBirthDate(birthDate);
        SetLocation(latitude, longitude);
        SetFormattedAddress(formattedAddress);
        SetPlaceId(placeId);
        SetStreetAddress(streetAddress);
        CreatedAt = DateTime.UtcNow;
    }

    public FirstName FirstName { get; private set; } = default!;
    public LastName LastName { get; private set; } = default!;
    public FullName FullName { get; private set; } = default!;
    public string? PhotoUrl { get; private set; }
    public string? Biography { get; private set; }
    public int NeighborhoodId { get; private set; }
    public DateOnly BirthDate { get; private set; }
    public Geolocation Location { get; private set; } = Geolocation.Empty;
    public bool IsLocationVerified { get; private set; } = false;
    public string PlaceId { get; private set; } = default!;
    public string StreetAddress { get; private set; } = default!;
    public string FormattedAddress { get; private set; } = default!;

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
    public void SetLocation(double? lat, double? lng)
    {
        Location = Geolocation.Create(lat, lng);
    }

    public void Verify(Geolocation deviceLocation)
    {
        if (deviceLocation.IsEmpty)
            throw new ArgumentException("Geçersiz cihaz konumu.", nameof(deviceLocation));

        if (Location.IsEmpty)
            throw new InvalidOperationException("Kayıtlı konum bilgisi olmayan bir kullanıcı doğrulanamaz.");

        double distance = Location.DistanceTo(deviceLocation);

        if (distance <= 500)
        {
            VerifyLocation();
        }
    }

    public void VerifyLocation()
    {
        if (IsLocationVerified)
            return;

        IsLocationVerified = true;
    }
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
    public void SetBirthDate(DateOnly birthDate)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (birthDate > today)
            throw new ArgumentException("Doğum tarihi bugünden ileri olamaz.");

        BirthDate = birthDate;
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
    public void SetFormattedAddress(string formattedAddress)
    {
        FormattedAddress = formattedAddress;
    }
    public void SetPlaceId(string placeId)
    {
        PlaceId = placeId;
    }
    public void SetStreetAddress(string streetAddress)
    {
        StreetAddress = streetAddress;
    }

}

