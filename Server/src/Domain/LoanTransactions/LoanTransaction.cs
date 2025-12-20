using Domain.Abstractions;
using Domain.LoanTransactions.Enums;
using Domain.Shared.ValueObjects;

namespace Domain.LoanTransactions;

public sealed class LoanTransaction : AggregateRoot
{
    public Guid BorrowRequestId { get; private set; }
    public Guid BorrowerId { get; private set; }
    public Guid LenderId { get; private set; }
    public TransactionStatus Status { get; private set; }
    public TimeSlot LoanPeriod { get; private set; } = default!;

    public DateTimeOffset? PickupCompletedAt { get; private set; }
    public Geolocation PickupLocation { get; private set; } = Geolocation.Empty;

    public DateTimeOffset? ReturnCompletedAt { get; private set; }
    public Geolocation ReturnLocation { get; private set; } = Geolocation.Empty;

    private readonly List<QrToken> qrTokens = new();
    public IReadOnlyCollection<QrToken> QrTokens => qrTokens.AsReadOnly();

    private LoanTransaction() { }
    public static LoanTransaction Create(
        Guid borrowRequestId,
        Guid borrowerId,
        Guid lenderId,
        TimeSlot loanPeriod)
    {
        if (borrowRequestId == Guid.Empty) throw new DomainException(nameof(borrowRequestId));
        if (borrowerId == Guid.Empty) throw new DomainException(nameof(borrowerId));
        if (lenderId == Guid.Empty) throw new DomainException(nameof(lenderId));
        if (borrowerId == lenderId) throw new DomainException("Borrower and lender cannot be the same.");
        if (loanPeriod.Start >= loanPeriod.End) throw new DomainException("LoanPeriod is invalid.");

        return new LoanTransaction
        {
            BorrowRequestId = borrowRequestId,
            BorrowerId = borrowerId,
            LenderId = lenderId,
            LoanPeriod = loanPeriod,
            Status = TransactionStatus.PendingPickup
        };
    }

    public void GenerateHandoverQr(string tokenHash, Geolocation pickupLocation)
    {
        if (Status != TransactionStatus.PendingPickup)
            throw new DomainException("Teslimat QR'ı sadece 'Teslimat Bekleniyor' aşamasında üretilebilir.");

        if (string.IsNullOrWhiteSpace(tokenHash))
            throw new DomainException("QR Token boş olamaz.");

        PickupLocation = pickupLocation;

        QrToken qrToken = QrToken.Create(this.Id, QrTokenType.Handover, tokenHash, 5);
        qrTokens.Add(qrToken);
    }

    public void ConfirmHandover(string tokenHash, DateTimeOffset pickupTime, Geolocation scanLocation)
    {
        if (Status != TransactionStatus.PendingPickup)
            throw new DomainException("İşlem teslimat aşamasında değil.");

        var token = qrTokens.FirstOrDefault(x => x.TokenHash == tokenHash);

        if (token == null)
            throw new DomainException("Geçersiz QR Token. Bu işlem için üretilmemiş.");

        token.MarkAsUsed(this.BorrowerId, pickupTime);

        if (token.Type != QrTokenType.Handover)
            throw new DomainException("Yanlış QR tipi okutuldu.");

        if (PickupLocation.DistanceTo(scanLocation) > 100)
            throw new DomainException("Buluşma noktanız aynı yerde tespit edilememiştir");

        Status = TransactionStatus.Active;
        PickupCompletedAt = pickupTime;
    }
}
