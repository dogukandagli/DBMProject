using Domain.Abstractions;

namespace Application.Services;

public interface IMailService
{
    Task SendAsync(string to, IEmailTemplate emailTemplate, CancellationToken cancellationToken);
}
