namespace Application.Services;

public interface IClaimContext
{
    Guid GetUserId();
    int GetNeighborhoodId();
}

