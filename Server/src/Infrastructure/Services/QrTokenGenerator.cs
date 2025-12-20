using Application.Common.Interfaces;
using System.Security.Cryptography;

namespace Infrastructure.Services;

public class QrTokenGenerator : IQrTokenGenerator
{
    private const int TokenLength = 32;

    public string Generate()
    {
        var randomBytes = new byte[TokenLength];

        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }

        string token = Convert.ToBase64String(randomBytes);

        token = token
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");

        return token;
    }
}
