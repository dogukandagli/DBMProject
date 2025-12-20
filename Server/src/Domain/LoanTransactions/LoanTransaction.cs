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
    public Geolocation? PickupLocation { get; private set; }

    public DateTimeOffset? ReturnCompletedAt { get; private set; }
    public Geolocation? ReturnLocation { get; private set; }

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

        if (pickupLocation.IsEmpty)
            throw new DomainException("Geçerli bir konum giriniz.");

        PickupLocation = pickupLocation;

        QrToken qrToken = QrToken.Create(this.Id, QrTokenType.Handover, tokenHash, 5);
        qrTokens.Add(qrToken);
    }

    public void ConfirmHandover(string tokenHash, Geolocation scanLocation)
    {
        if (Status != TransactionStatus.PendingPickup)
            throw new DomainException("İşlem teslimat aşamasında değil.");

        QrToken? token = qrTokens.FirstOrDefault(x => x.TokenHash == tokenHash);

        if (token == null)
            throw new DomainException("Geçersiz QR Token. Bu işlem için üretilmemiş.");

        if (token.Type != QrTokenType.Handover)
            throw new DomainException("Yanlış QR tipi okutuldu.");

        token.MarkAsUsed(this.BorrowerId, DateTimeOffset.UtcNow);

        if (PickupLocation is null)
            throw new DomainException("Buluşma noktası tanımlı değil");

        if (PickupLocation.DistanceTo(scanLocation) > 100)
            throw new DomainException("Buluşma noktanız aynı yerde tespit edilememiştir");

        Status = TransactionStatus.Active;
        PickupCompletedAt = DateTimeOffset.UtcNow;
    }

    public void GenerateReturnQr(string tokenHash, Geolocation returnLocation)
    {
        if (Status is not (TransactionStatus.Active or TransactionStatus.PendingReturn))
            throw new DomainException("İade QR'ı sadece aktif aşamasında üretilebilir.");

        if (string.IsNullOrWhiteSpace(tokenHash))
            throw new DomainException("QR Token boş olamaz.");

        ReturnLocation = returnLocation;

        QrToken qrToken = QrToken.Create(this.Id, QrTokenType.Return, tokenHash, 5);
        qrTokens.Add(qrToken);

        Status = TransactionStatus.PendingReturn;
    }

    public void ConfirmReturn(string tokenHash, Geolocation scanLocation)
    {
        if (Status != TransactionStatus.PendingReturn)
            throw new DomainException("Ödünç alan kişi Qr oluşturmadı.");

        QrToken? token = qrTokens.FirstOrDefault(x => x.TokenHash == tokenHash);

        if (token == null)
            throw new DomainException("Geçersiz QR Token. Bu işlem için üretilmemiş.");

        if (token.Type != QrTokenType.Return)
            throw new DomainException("Yanlış QR tipi okutuldu.");

        token.MarkAsUsed(this.BorrowerId, DateTimeOffset.UtcNow);

        if (ReturnLocation is null)
            throw new DomainException("Buluşma noktası tanımlı değil");

        if (ReturnLocation.DistanceTo(scanLocation) > 100)
            throw new DomainException("Buluşma noktanız aynı yerde tespit edilememiştir");

        Status = TransactionStatus.Completed;
        ReturnCompletedAt = DateTime.UtcNow;
    }
}
