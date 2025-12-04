using Domain.Abstractions;
using Domain.Events.Enums;


namespace Domain.Events;

public sealed class EventMedia : AuditableEntity
{
    public Guid EventId { get; private set; }
    public string Url { get; private set; } = default!;
    public int OrderNo { get; private set; }
    public EventMediaType MediaType { get; private set; }
    private EventMedia() { }

    public EventMedia(string url, int orderNo, EventMediaType mediaType) 
    {
        if (string.IsNullOrWhiteSpace(url)) throw new ArgumentNullException(nameof(url));

        Url = url;
        OrderNo = orderNo;
        MediaType = mediaType;
    }

    public void UpdateOrder(int newOrderNo)
    {
        OrderNo = newOrderNo;
    }

}

