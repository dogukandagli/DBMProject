namespace Domain.Abstractions;

public interface IEmailTemplate
{
    string GetSubject();
    string GetBody();
}

