using Domain.Abstractions;
using Domain.BorrowRequests.Enums;
using Domain.BorrowRequests.Events;
using Domain.BorrowRequests.ValueObjects;
using Domain.Shared.ValueObjects;

namespace Domain.BorrowRequests;

public sealed class BorrowRequest : AggregateRoot
{
    public int NeighborhoodId { get; private set; }
    public Guid BorrowerId { get; private set; }
    public ItemSpecification ItemNeeded { get; private set; } = default!;
    public TimeSlot NeededDates { get; private set; } = default!;
    public BorrowRequestStatus Status { get; private set; }

    private readonly List<Offer> offers = new();
    public IReadOnlyCollection<Offer> Offers => offers.AsReadOnly();

    private BorrowRequest() { }

    public static BorrowRequest Create(
        Guid borrowerId,
        ItemSpecification itemNeeded,
        TimeSlot neededDates,
        int neighborhoodId)
    {
        BorrowRequest borrowRequest = new BorrowRequest
        {
            BorrowerId = borrowerId,
            ItemNeeded = itemNeeded,
            NeededDates = neededDates,
            Status = BorrowRequestStatus.Open,
            NeighborhoodId = neighborhoodId
        };
        borrowRequest.AddDomainEvent(new BorrowRequestCreatedEvent(
            borrowRequest.Id,
            borrowerId,
            itemNeeded,
            neededDates,
            DateTime.UtcNow));

        return borrowRequest;
    }

    public void AddOffer(
        Guid lenderId,
        string description,
        Condition condition,
        HandoverMethod handoverMethod,
        List<string>? photoUrls,
        TimeSlot? availableTimeSlot)
    {
        if (Status != BorrowRequestStatus.Open)
            throw new DomainException("Bu ilana artık teklif verilemez (Kapalı veya süresi dolmuş).");

        if (NeededDates.IsExpired())
        {
            Status = BorrowRequestStatus.Expired;
            throw new DomainException("İlanın süresi dolmuş.");
        }

        if (lenderId == BorrowerId)
            throw new DomainException("Kendi ilanına teklif veremezsin.");

        if (offers.Any(o => o.LenderId == lenderId))
            throw new DomainException("Bu ilana zaten bir teklif verdiniz. Mevcut teklifinizi güncelleyebilirsiniz.");

        Offer offer = Offer.Create(
            this.Id,
            lenderId,
            description,
            condition,
            handoverMethod,
            photoUrls,
            availableTimeSlot);

        offers.Add(offer);

        AddDomainEvent(new OfferCreatedDomainEvent(
            this.Id,
            this.BorrowerId,
            lenderId,
            offer.Id));
    }

    public void AcceptOffer(Guid offerId)
    {
        if (Status != BorrowRequestStatus.Open)
            throw new DomainException("İlan aktif değil, işlem yapılamaz.");

        Offer? selectedOffer = offers.FirstOrDefault(o => o.Id == offerId);
        if (selectedOffer is null)
            throw new DomainException("Teklif bulunamadı.");

        selectedOffer.Accept();

        foreach (var otherOffer in offers.Where(o => o.Id != offerId))
        {
            otherOffer.AutoReject();
        }

        Status = BorrowRequestStatus.Accepted;

        AddDomainEvent(new OfferAcceptedDomainEvent(
            this.Id,
            this.BorrowerId,
            selectedOffer.LenderId,
            selectedOffer.Id,
            this.ItemNeeded.Title));
    }

    public void RejectOffer(Guid offerId)
    {
        if (Status != BorrowRequestStatus.Open)
            throw new DomainException("İlan aktif değil, işlem yapılamaz.");

        Offer? selectedOffer = offers.FirstOrDefault(o => o.Id == offerId);
        if (selectedOffer is null)
            throw new DomainException("Teklif bulunamadı.");

        selectedOffer.Reject();

        AddDomainEvent(new OfferRejectedDomainEvent(this.Id, selectedOffer.Id));
    }

    public void Cancel(Guid cancelledBy)
    {
        if (cancelledBy != BorrowerId)
            throw new DomainException("Bu ilanı iptal etme yetkiniz yok.");

        if (Status != BorrowRequestStatus.Open)
            throw new DomainException("Yalnızca açık talepler iptal edilebilir.");

        if (offers.Any(o => o.Status == OfferStatus.Accepted))
            throw new DomainException("Kabul edilmiş istek var iptal edemezsiniz.");

        Status = BorrowRequestStatus.Cancelled;

        foreach (Offer offer in offers)
        {
            offer.AutoReject();
        }
        AddDomainEvent(new BorrowRequestCancelledDomainEvent(this.Id));
    }

    public void Complete()
    {
        if (Status != BorrowRequestStatus.Accepted)
            throw new DomainException("Tamamlamak için istek kabul edilmelidir.");

        Status = BorrowRequestStatus.Completed;
    }

    public void Cancel(Guid lenderId, Guid offerId)
    {
        Offer? selectedOffer = offers.FirstOrDefault(o => o.Id == offerId);
        if (selectedOffer is null)
            throw new DomainException("Teklif bulunamadı.");

        if (selectedOffer.LenderId != lenderId)
            throw new DomainException("Yetkisiz işlem.");

        selectedOffer.Cancel();
        AddDomainEvent(new OfferCancelledDomainEvent(this.Id, selectedOffer.Id));
    }

}
