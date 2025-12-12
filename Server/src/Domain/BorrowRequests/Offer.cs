using Domain.Abstractions;
using Domain.BorrowRequests.Enums;
using Domain.BorrowRequests.ValueObjects;
using Domain.Shared.ValueObjects;

namespace Domain.BorrowRequests;

public sealed class Offer : AuditableEntity
{
    public UserId LenderId { get; private set; }
    public OfferedItem OfferedItem { get; private set; } = default!;

    public HandoverMethod HandoverMethod { get; private set; }
    public TimeSlot? AvailableTimeSlot { get; private set; }

    public OfferStatus Status { get; private set; }
    public DateTimeOffset? AcceptedAt { get; private set; }

    private readonly List<Photo> photoUrls = new();
    public IReadOnlyCollection<Photo> PhotoUrls => photoUrls.AsReadOnly();

    private Offer() { }

    internal static Offer Create(
        UserId lenderId,
        string description,
        Condition condition,
        HandoverMethod handoverMethod,
        List<string>? photoUrls,
        TimeSlot? availableTimeSlot)
    {
        OfferedItem offeredItem = OfferedItem.Create(description, condition);

        Offer offer = new Offer
        {
            LenderId = lenderId,
            OfferedItem = offeredItem,
            HandoverMethod = handoverMethod,
            AvailableTimeSlot = availableTimeSlot,
            Status = OfferStatus.Pending,
        };
        if (photoUrls != null && photoUrls.Any())
        {
            for (int i = 0; i < photoUrls.Count; i++)
            {
                bool isMain = (i == 0);
                offer.photoUrls.Add(Photo.Create(photoUrls[i], isMain, i));
            }
        }
        return offer;
    }

    internal void Accept()
    {
        if (Status != OfferStatus.Pending)
            throw new DomainException("Yalnızca bekleyen teklifler kabul edilebilir.");

        Status = OfferStatus.Accepted;
        AcceptedAt = DateTimeOffset.UtcNow;
    }

    internal void Reject()
    {
        if (Status != OfferStatus.Pending)
            throw new DomainException("Yalnızca bekleyen teklifler red edilebilir.");

        Status = OfferStatus.Rejected;
    }

    internal void Cancel()
    {
        if (Status != OfferStatus.Pending)
            throw new DomainException("Yalnızca bekleyen teklifler iptal edilebilir.");

        Status = OfferStatus.Cancelled;
    }
}
