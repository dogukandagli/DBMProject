using Application.Services;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Services;

public class TempTokenProvider(
    IOptions<JwtOptions> options) : ITempTokenProvider
{
    public string GenerateTicket(int neighborhoodId, TimeSpan validity)
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
                new Claim("neighborhoodId", neighborhoodId.ToString())
            }
        );

        string token = tokenHandler.WriteToken(securityToken);
        return token;
    }

    public int? ValidateTicket(string ticket)
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

            return int.Parse(neighborhoodIdClaim);

        }
        catch
        {
            return null;
        }

    }
}
