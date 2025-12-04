using Domain.Abstractions;
using Domain.Events.Enums;
using Domain.Posts;
using Domain.Shared;

namespace Domain.Events;

public sealed class Event : AggregateRoot
{
    public int NeighborhoodId { get; private set; }
    public string Title { get; private set; } = default!;
    public string Description { get; private set; } = default!;

    private readonly List<EventMedia> eventMedias = new List<EventMedia>();
    public IReadOnlyCollection<EventMedia> EventMedias => eventMedias.AsReadOnly();

    private readonly List<EventCategory> eventCategories = new List<EventCategory>();
    public IReadOnlyCollection<EventCategory> Categories => eventCategories.AsReadOnly();

    private readonly List<EventParticipant> eventParticipants = new List<EventParticipant>();
    public IReadOnlyCollection<EventParticipant> Participants => eventParticipants.AsReadOnly();
    public Geolocation Location { get; private set; } = Geolocation.Empty;
    public DateTime StartAt { get; private set; }
    public DateTime? EndAt { get; private set; }
    public StatusType Status { get; private set; }
    public EventVisibility Visibility { get; private set; }
    public double Price { get; private set; }
    public int Capacity { get; private set; }
    public int CurrentCount { get; private set; }

    private Event() {   }
    public Event(
        int neighborhoodId,
        string title,
        string description,
        DateTime startAt,
        DateTime? endAt,
        StatusType status,
        EventVisibility visibility,
        int price,
        int capacity,
        double? latitude = null,
        double? longitude = null
        )
    {
        SetNeighborhoodId(neighborhoodId);
        SetTitle(title);
        SetDescription(description);
        Reschedule(startAt, endAt);
        SetEventStatus(status);
        SetEventVisibility(visibility);
        SetPrice(price);
        SetCapacity(capacity);
        SetLocation(latitude, longitude);
    }
    public void AddParticipant(int userId)
    {
        if (userId <= 0)
        {
            throw new ArgumentException("Geçersiz kullanıcı ID'si.");
        }

        if (eventParticipants.Any(p => p.UserId == userId))
        {
            throw new ArgumentException("Kullanıcı zaten etkinliğe katılmış.");
        }

        if (Status == StatusType.Cancelled)
        {
            throw new InvalidOperationException("Bu etkinlik iptal edilmiştir.");
        }

        if (EndAt.HasValue && DateTime.UtcNow > EndAt.Value)
        {
            throw new InvalidOperationException("Bu etkinlik sona ermiştir, kayıt yapılamaz.");
        }

        if (CurrentCount >= Capacity)
        {
            throw new InvalidOperationException("Etkinlik kapasitesi doldu.");
        }

        EventParticipant participant = new EventParticipant(userId);

        eventParticipants.Add(participant);
        CurrentCount++;
    }

    public void RemoveParticipant(int userId)
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

    public void AddCategory(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentNullException(nameof(name), "Kategori adı boş veya null olamaz.");
        }

        if (eventCategories.Any(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase)))
        {
            throw new ArgumentException("Bu isimde bir kategori zaten mevcut.");
        }

        EventCategory category = new EventCategory(name);

        eventCategories.Add(category);
    }
    public void AddMedia(string mediaUrl, EventMediaType mediaType)
    {
        if (EventMedias.Count > 10)
        {
            throw new ArgumentException("Bir event gönderisinde 10 dan fazla medya bulunamaz!");
        }

        int orderNo = EventMedias.Count;

        EventMedia eventMedia = new(mediaUrl, orderNo, mediaType);
        eventMedias.Add(eventMedia);
    }
    public void SetNeighborhoodId(int neighborhoodId)
    {
        if (neighborhoodId <= 0) 
        {
            throw new ArgumentException("Geçersiz mahalle ID'si.");
        }
        NeighborhoodId = neighborhoodId;
    }
    public void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Etkinlik başlığı boş olamaz.");
        }
        Title = title;
    }
    public void SetDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new ArgumentException("Etkinlik açıklaması boş olamaz.");
        }
        Description = description;
    }
    public void Reschedule(DateTime startAt, DateTime? endAt)
    {
        if (endAt.HasValue && startAt > endAt.Value)
            throw new ArgumentException("Hatalı tarih girilmiştir.");

        StartAt = startAt;
        EndAt = endAt;
    }
    public void SetEventStatus(StatusType status)
    {
        if (!Enum.IsDefined(typeof(StatusType), status))
        {
            throw new ArgumentException("Geçersiz etkinlik durumu.");
        }
        Status = status;
    }
    public void SetEventVisibility(EventVisibility visibility)
    {
        if (!Enum.IsDefined(typeof(EventVisibility), visibility))
        {
            throw new ArgumentException("Geçersiz etkinlik görünürlüğü.");
        }
        Visibility = visibility;
    }
    public void SetPrice(double price)
    {
        if (price < 0)
        {
            throw new ArgumentException("Fiyat negatif olamaz.");
        }
        Price = price;
    }
    public void SetCapacity(int capacity)
    {
        if (capacity < 0)
        {
            throw new ArgumentException("Kapasite negatif olamaz.");
        }
        Capacity = capacity;
    }
    public void SetLocation(double? lat, double? lng)
    {
        if (lat.HasValue && lng.HasValue)
        {
            if (lat < -90 || lat > 90)
            {
                throw new ArgumentException("Geçersiz enlem değeri.");
            }
            if (lng < -180 || lng > 180)
            {
                throw new ArgumentException("Geçersiz boylam değeri.");
            }
        }
        Location = Geolocation.Create(lat, lng);
    }

}