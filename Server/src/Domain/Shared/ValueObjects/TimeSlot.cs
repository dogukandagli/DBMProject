namespace Domain.Shared.ValueObjects;

public sealed record TimeSlot
{
    public DateTimeOffset Start { get; init; }
    public DateTimeOffset End { get; init; }
    private TimeSlot(DateTimeOffset start, DateTimeOffset end)
    {
        Start = start;
        End = end;
    }

    public static TimeSlot Create(DateTimeOffset start, DateTimeOffset end)
    {
        if (end <= start)
            throw new ArgumentException("Bitiş zamanı, başlangıç zamanından sonra olmalıdır.");

        if (start < DateTime.UtcNow)
            throw new ArgumentException("Başlangıç zamanı geçmişte olamaz");

        return new TimeSlot(start, end);
    }

    public TimeSpan Duration => End - Start;

    public bool IsExpired() => DateTime.UtcNow > End;

    public bool IsActive()
    {
        var now = DateTime.UtcNow;
        return now >= Start && now <= End;
    }

    public bool Overlaps(TimeSlot other)
    {
        return this.Start < other.End && this.End > other.Start;
    }
}
