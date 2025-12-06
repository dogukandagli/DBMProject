namespace Application.Auth;

public sealed class UserDto
{
    public Guid Id { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string? ProfilePhotoUrl { get; set; }
    public string? CoverPhotoUrl { get; set; }
    public bool IsLocationVerified { get; set; }
    public int NeighborhoodId { get; set; }
    public string City { get; set; } = default!;
    public string District { get; set; } = default!;
    public string Neighborhood { get; set; } = default!;
    public string LocationText { get; set; } = default!;
    public string? Biography { get; set; }

}
