using Application.Services;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Infrastructure.Services;

public sealed class ClaimContext(IHttpContextAccessor httpContextAccessor) : IClaimContext
{
    public int GetNeighborhoodId()
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null)
        {
            throw new ArgumentNullException("context bilgisi bulunamadı");
        }
        var claims = httpContext.User.Claims;
        string? neighborhoodId = claims.FirstOrDefault(i => i.Type == "neighborhoodId")?.Value;
        if (neighborhoodId is null)
        {
            throw new ArgumentNullException("Mahalle bilgisi bulunamadı");
        }
        try
        {
            int id = int.Parse(neighborhoodId);
            return id;
        }
        catch (Exception)
        {
            throw new ArgumentException("Mahalle id uygun int formatında değil");
        }
    }

    public Guid GetUserId()
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null)
        {
            throw new ArgumentNullException("context bilgisi bulunamadı");
        }
        var claims = httpContext.User.Claims;
        string? userId = claims.FirstOrDefault(i => i.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
        {
            throw new ArgumentNullException("Kullanıcı bilgisi bulunamadı");
        }
        try
        {
            Guid id = Guid.Parse(userId);
            return id;
        }
        catch (Exception)
        {
            throw new ArgumentException("Kullanıcı id uygun Guid formatında değil");
        }
    }
}
