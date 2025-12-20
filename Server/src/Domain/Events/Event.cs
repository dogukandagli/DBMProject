using Domain.Abstractions;
using Domain.Shared.ValueObjects;


namespace Domain.Events;

public class Event : AggregateRoot
{
    public int NeighborhoodId { get; private set; }
    public string Title { get; private set; } = default!;
    public string? Description { get; private set; }
    public string? CoverPhotoUrl { get; private set; }

    private readonly List<EventParticipant> _participants = new List<EventParticipant>();
    public IReadOnlyCollection<EventParticipant> Participants => _participants.AsReadOnly();
    public Geolocation Location { get; private set; } = Geolocation.Empty;
    public DateTimeOffset StartAt { get; private set; }
    public DateTimeOffset? EndAt { get; private set; }
    public StatusType Status { get; private set; }
    public EventVisibility Visibility { get; private set; }
    public decimal? Price { get; private set; }
    public int? Capacity { get; private set; }
    public int CurrentCount { get; private set; } = 0;

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

        if (IsOwner(userId))
        {
            throw new ArgumentException("Zaten bu etkinliğin sahibisiniz.");
        }

        if (IsAdded(userId))
        {
            throw new ArgumentException("Zaten bu etkinliğe katıldınız.");
        }

        if (IsCancelled())
        {
            throw new InvalidOperationException("Bu etkinlik iptal edilmiştir, kayıt yapılamaz.");
        }

        if (IsCompleted())
        {
            throw new InvalidOperationException("Bu etkinlik tamamlanmıştır, kayıt yapılamaz.");
        }

        if (Capacity is not null && CurrentCount >= Capacity)
        {
            throw new InvalidOperationException("Etkinlik kapasitesi doldu.");
        }

        EventParticipant participant = EventParticipant.CreateEventParticipant(userId, this.Id);

        _participants.Add(participant);
        CurrentCount++;
    }

    public void RemoveParticipant(Guid userId)
    {
        EventParticipant? participant = _participants.FirstOrDefault(p => p.UserId == userId);

        if (IsOwner(userId))
        {
            throw new InvalidOperationException("Etkinliğin kurucusu kendini etkinlikten çıkaramaz.");
        }

        if (participant is null)
        {
            throw new InvalidOperationException("Katılmadığınız etkinlikten çıkamazsınız.");
        }

        if (IsCancelled())
        {
            throw new InvalidOperationException("İptal edilmiş etkinlikten katılımcı çıkarılamaz.");
        }

        if (IsCompleted())
        {
            throw new InvalidOperationException("Tamamlanmış etkinlikten katılımcı çıkarılamaz.");
        }

        _participants.Remove(participant);
        CurrentCount--;
    } 
    override
    public void Delete()
    {
        if (!IsCompleted() || !IsCancelled())
        {
            throw new DomainException("Etkinliği silemezsiniz.");
        }

        Delete();
    }
    public bool IsAdded(Guid userId)
    {
        return _participants.Any(p => p.UserId == userId);
    }

    public bool IsOwner(Guid userId)
    {
        return this.CreatedBy == userId;
    }
    public bool IsCancelled()
    {
        return Status == StatusType.Cancelled;
    }

    public bool IsCompleted()
    {
        if (Status == StatusType.Cancelled) 
            return false;

        if (EndAt.HasValue && DateTimeOffset.UtcNow > EndAt.Value) 
            return true;

        return false;
    }

    public bool CapacityCheck()
    {
        return Capacity > _participants.Count;
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
        if (IsCompleted())
            throw new InvalidOperationException("Tamamlanmış etkinlik iptal edilemez.");
        if (IsCancelled())
            throw new InvalidOperationException("Etkinlik zaten iptal edilmiştir.");
        if(StartAt <= DateTimeOffset.UtcNow)
            throw new InvalidOperationException("Devam eden etkinlik silinemez.");

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