namespace Application.Services;

public interface ITempTokenProvider
{
    string GenerateTicket(int neighborhoodId, TimeSpan validity);
    int? ValidateTicket(string ticket);
}
