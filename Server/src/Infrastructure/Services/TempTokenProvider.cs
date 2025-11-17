using Application.Auth;
using Application.Services;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Services;

public class TempTokenProvider(
    IOptions<JwtOptions> options) : ITempTokenProvider
{
    public string GenerateTicket(int neighborhoodId, double latitude, double longitude, TimeSpan validity)
    {
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(options.Value.TicketSecretKey));
        SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha512);

        JwtSecurityToken securityToken = new JwtSecurityToken(
            issuer: options.Value.Issuer,
            audience: options.Value.Issuer,
            expires: DateTime.UtcNow.Add(validity),
            signingCredentials: signingCredentials,
            claims: new List<Claim>
            {
                new Claim("neighborhoodId", neighborhoodId.ToString()),
                new Claim("latitude",latitude.ToString(CultureInfo.InvariantCulture)),
                new Claim("Longitude",latitude.ToString(CultureInfo.InvariantCulture))
            }
        );

        string token = tokenHandler.WriteToken(securityToken);
        return token;
    }

    public TicketValidationResult? ValidateTicket(string ticket)
    {
        try
        {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            tokenHandler.ValidateToken(ticket, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Value.TicketSecretKey)),
                ValidateIssuer = true,
                ValidIssuer = options.Value.Issuer,
                ValidateAudience = true,
                ValidAudience = options.Value.Issuer,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            JwtSecurityToken jwtToken = (JwtSecurityToken)validatedToken;

            string neighborhoodIdClaim = jwtToken.Claims.First(x => x.Type == "neighborhoodId").Value;
            string latitudeClaim = jwtToken.Claims.First(x => x.Type == "latitude").Value;
            string longitudeClaim = jwtToken.Claims.First(x => x.Type == "Longitude").Value;


            TicketValidationResult ticketValidationResult = new(int.Parse(neighborhoodIdClaim),
                double.Parse(latitudeClaim, CultureInfo.InvariantCulture),
                double.Parse(longitudeClaim, CultureInfo.InvariantCulture));

            return ticketValidationResult;

        }
        catch
        {
            return null;
        }

    }
}
