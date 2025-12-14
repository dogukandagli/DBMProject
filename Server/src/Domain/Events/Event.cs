using Domain.Abstractions;
using Domain.Events.Enums;
using Domain.Shared;
using Domain.Shared.ValueObjects;

namespace Domain.Events;

public class Event : AggregateRoot
{
    public int NeighborhoodId { get; private set; }
    public string Title { get; private set; } = default!;
    public string? Description { get; private set; }
    public string? CoverPhotoUrl { get; private set; }

    private readonly List<EventParticipant> eventParticipants = new List<EventParticipant>();
    public IReadOnlyCollection<EventParticipant> Participants => eventParticipants.AsReadOnly();
    public Geolocation Location { get; private set; } = Geolocation.Empty;
    public DateTimeOffset StartAt { get; private set; }
    public DateTimeOffset? EndAt { get; private set; }
    public StatusType Status { get; private set; }
    public EventVisibility Visibility { get; private set; }
    public decimal? Price { get; private set; }
    public int? Capacity { get; private set; }
    public int CurrentCount { get; private set; }

    private Event() {   }


    public static Event Create(
        int neighborhoodId,
        string title, 
        DateTimeOffset eventStartDate,
        Geolocation geolocation
        )

    {
        if (neighborhoodId <= 0)
        {
            throw new ArgumentException("Geçersiz mahalle ID'si.");
        }
       
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Etkinlik başlığı boş olamaz.");
        }

        if (eventStartDate < DateTimeOffset.UtcNow)
        {
            throw new ArgumentException("Etkinlik tarihi geçmişte olamaz.");
        }

        if (geolocation == null || geolocation == Geolocation.Empty)
        {
            throw new ArgumentException("Geçerli bir konum seçilmelidir.");
        }

        var initialStatus = eventStartDate <= DateTimeOffset.UtcNow
        ? StatusType.Ongoing
        : StatusType.Upcoming;

        return new Event()
        {
            NeighborhoodId = neighborhoodId,
            Title = title,
            StartAt = eventStartDate,
            Location = geolocation,
            Status = initialStatus
        };
    }
    public void AddParticipant(Guid userId)
    {

        if (eventParticipants.Any(p => p.UserId == userId))
        {
            throw new ArgumentException("Zaten bu etkinkige katildiniz");
        }

        if (Status == StatusType.Cancelled)
        {
            throw new InvalidOperationException("Bu etkinlik iptal edilmiştir.");
        }

        if (EndAt.HasValue && DateTime.UtcNow > EndAt.Value)
        {
            throw new InvalidOperationException("Bu etkinlik sona ermiştir, kayıt yapılamaz.");
        }
        if (Capacity is not null && CurrentCount >= Capacity)
        {
            throw new InvalidOperationException("Etkinlik kapasitesi doldu.");
        }

        EventParticipant participant = EventParticipant.CreateEventParticipant(userId, this.Id);

        eventParticipants.Add(participant);
        CurrentCount++;
    }

    public void RemoveParticipant(Guid userId)
    {
        if(Status == StatusType.Completed || Status == StatusType.Cancelled)
        {
            throw new InvalidOperationException("İptal edilmiş veya tamamlanmış etkinlikten katılımcı çıkarılamaz.");
        }

        EventParticipant? participant = eventParticipants.FirstOrDefault(p => p.UserId == userId);

        if (participant == null)
        {
            throw new ArgumentException("Kullanıcı etkinliğe katılmamış.");
        }
        eventParticipants.Remove(participant);
        CurrentCount--;
    }

    public void SetDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new ArgumentException("Etkinlik açıklaması boş olamaz.");
        }
        Description = description;
    }
    public void SetEndTime(DateTimeOffset? endAt)
    {
        EndAt = endAt;
    }
    public void SetCoverPhoto(string? coverPhotoUrl) 
    {
        CoverPhotoUrl = coverPhotoUrl;
    }

    public void Cancel()
    {
        if (Status == StatusType.Completed)
            throw new InvalidOperationException("Tamamlanmış etkinlik iptal edilemez.");

        Status = StatusType.Cancelled;
    }

    public void SetEventVisibility(EventVisibility visibility)
    {
        if (!Enum.IsDefined(typeof(EventVisibility), visibility))
        {
            throw new ArgumentException("Geçersiz etkinlik görünürlüğü.");
        }
        Visibility = visibility;
    }
    public void SetPrice(decimal? price)
    {
        if (price < 0)
        {
            throw new ArgumentException("Fiyat negatif olamaz.");
        }
        Price = price;
    }
    public void SetCapacity(int? capacity)
    {
        if (capacity < 0)
        {
            throw new ArgumentException("Kapasite negatif olamaz.");
        }
        Capacity = capacity;
    }


}