namespace Infrastructure.Options;

public sealed class MailSettingOptions
{
    public string Host { get; set; } = default!;
    public int Port { get; set; } = default!;
    public string User { get; set; } = default!;
    public string Password { get; set; } = default!;
}
