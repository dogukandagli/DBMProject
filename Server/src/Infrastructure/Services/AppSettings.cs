using Application.Services;
using Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services;

public sealed class AppSettings(IOptions<AppSettingOptions> appSettingOptions) : IAppSettings
{
    public string GetBaseUrl()
    {
        return appSettingOptions.Value.FrontendBaseUrl;
    }
}
