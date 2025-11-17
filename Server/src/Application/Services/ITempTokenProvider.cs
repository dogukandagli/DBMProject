using Application.Auth;

namespace Application.Services;

public interface ITempTokenProvider
{
    string GenerateTicket(int neighborhoodId, double latitude, double Longitude, TimeSpan validity);
    TicketValidationResult? ValidateTicket(string ticket);
}
