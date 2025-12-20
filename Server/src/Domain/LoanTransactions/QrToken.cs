using Domain.Abstractions;
using Domain.LoanTransactions.Enums;

namespace Domain.LoanTransactions;

public sealed class QrToken : AuditableEntity
{
    public Guid LoanTransactionId { get; private set; }
    public string TokenHash { get; private set; } = default!;
    public QrTokenType Type { get; private set; }
    public DateTimeOffset ExpiresAt { get; private set; }

    public DateTimeOffset? UsedAt { get; private set; }
    public bool IsUsed => UsedAt.HasValue;
    public Guid? UsedByUserId { get; private set; }

    private QrToken() { }

    public static QrToken Create(
        Guid loanTransactionId,
        QrTokenType qrTokenType,
        string tokenHash,
        int durationMinutes = 5
        )
    {
        return new QrToken
        {
            LoanTransactionId = loanTransactionId,
            Type = qrTokenType,
            TokenHash = tokenHash,
            ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(durationMinutes)

        };
    }

    public void MarkAsUsed(Guid userId, DateTimeOffset usedTime)
    {
        if (IsUsed)
        {
            throw new DomainException("Bu QR kod daha önce kullanılmış.");
        }
        if (usedTime > ExpiresAt)
        {
            throw new DomainException("QR kod süresi dolmuş.");
        }
        UsedAt = usedTime;
        UsedByUserId = userId;
    }
}
