using Application.Services;
using FluentEmail.Core;

namespace Infrastructure.Services;

internal sealed class MailService(IFluentEmail fluentEmail) : IMailService
{
    public async Task SendAsync(string to, string subject, string body, CancellationToken cancellationToken)
    {
        var sendResponse = await fluentEmail
            .To(to)
            .Subject(subject)
            .Body(body, true)
            .SendAsync(cancellationToken);

        if (!sendResponse.Successful)
        {
            throw new ArgumentException(string.Join(", ", sendResponse.ErrorMessages));
        }
    }
}
