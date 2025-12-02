using Application.Services;
using Domain.Users;
using Infrastructure.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Services;

internal sealed class JwtProvider(IOptions<JwtOptions> options, IHttpContextAccessor httpContextAccesor) : IJwtProvider
{
    public async Task<string> CreateTokenAsync(AppUser appUser, CancellationToken cancellationToken = default)
    {
        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.NameIdentifier, appUser.Id.ToString()),
            new Claim(ClaimTypes.Email, appUser.Email!),
            new Claim(JwtRegisteredClaimNames.Name, appUser.UserName!),
            new Claim(JwtRegisteredClaimNames.Typ, "access"),
            new Claim("neighborhoodId",appUser.NeighborhoodId.ToString())
        };
        SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(options.Value.SecretKey));
        SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha512);

        var expires = DateTime.Now.AddMinutes(15);

        JwtSecurityToken securityToken = new(
                issuer: options.Value.Issuer,
          audience: options.Value.Audience,
          claims: claims,
          notBefore: DateTime.Now,
          expires: expires,
          signingCredentials: signingCredentials
            );

        JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();

        string token = handler.WriteToken(securityToken);

        return await Task.FromResult(token);
    }
    public Task<string> CreateRefreshTokenAsync(AppUser appUser, CancellationToken cancellationToken = default)
    {
        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.NameIdentifier, appUser.Id.ToString()),
            new Claim(ClaimTypes.Email, appUser.Email!),
            new Claim(JwtRegisteredClaimNames.Name, appUser.UserName!),
            new Claim(JwtRegisteredClaimNames.Typ, "refresh")
        };

        SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(options.Value.RefreshSecretKey));
        SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha512);

        var expires = DateTime.Now.AddDays(15);

        JwtSecurityToken securityToken = new(
                issuer: options.Value.Issuer,
          audience: options.Value.Audience,
          claims: claims,
          notBefore: DateTime.Now,
          expires: expires,
          signingCredentials: signingCredentials
            );

        JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
        string refreshToken = handler.WriteToken(securityToken);

        httpContextAccesor.HttpContext?.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = expires
        });

        return Task.FromResult(refreshToken);
    }


    public Task<(bool Ok, string? UserId)> ValidateRefreshToken(CancellationToken cancellationToken = default)
    {
        var refresh = httpContextAccesor.HttpContext?.Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refresh))
        {
            return Task.FromResult<(bool, string?)>((false, null));
        }
        var handler = new JwtSecurityTokenHandler();
        var param = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = options.Value.Issuer,
            ValidateAudience = true,
            ValidAudience = options.Value.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Value.RefreshSecretKey)),
        };
        try
        {
            var principal = handler.ValidateToken(refresh, param, out _);

            if (principal.FindFirst(JwtRegisteredClaimNames.Typ)?.Value != "refresh")
            {
                return Task.FromResult<(bool, string?)>((false, null));
            }

            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);

            return Task.FromResult((!string.IsNullOrEmpty(userId), userId));
        }
        catch { return Task.FromResult<(bool, string?)>((false, null)); }
    }
}
