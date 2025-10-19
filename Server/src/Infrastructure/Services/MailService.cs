using Application.Services;
using Domain.Abstractions;
using FluentEmail.Core;

namespace Infrastructure.Services;

internal sealed class MailService(IFluentEmail fluentEmail) : IMailService
{

    public async Task SendAsync(string to, IEmailTemplate emailTemplate, CancellationToken cancellationToken)
    {
        var sendResponse = await fluentEmail
            .To(to)
            .Subject(emailTemplate.GetSubject())
            .Body(emailTemplate.GetBody(), true)
            .SendAsync(cancellationToken);

        if (!sendResponse.Successful)
        {
            throw new ArgumentException(string.Join(", ", sendResponse.ErrorMessages));
        }
    }
}
