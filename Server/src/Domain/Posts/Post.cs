using Domain.Abstractions;
using Domain.Shared;

namespace Domain.Posts;

public sealed class Post : AggregateRoot
{
    public int NeighborhoodId { get; private set; }
    public string Content { get; private set; } = default!;
    private readonly List<PostMedia> postMedias = new List<PostMedia>();
    public IReadOnlyCollection<PostMedia> Medias => postMedias.AsReadOnly();
    public Geolocation Location { get; private set; } = Geolocation.Empty;
    public PostType PostType { get; private set; }
    public PostVisibilty PostVisibilty { get; private set; }
    public string? ReadableAddress { get; private set; }
    private Post() { }
    public Post(
        int neighborhoodId,
        string content,
        PostType postType,
        PostVisibilty postVisibilty,
        double? latitude = null
        , double? longitude = null
        , string? address = null
        )
    {
        SetContent(content);
        SetPostType(postType);
        SetLocation(latitude, longitude);
        SetNeighborhoodId(neighborhoodId);
        SetPostVisibilty(postVisibilty);
        SetReadableAddress(address);
    }
    public void AddMedia(string mediaUrl, MediaType mediaType)
    {
        if (Medias.Count > 10)
        {
            throw new ArgumentException("Bir postta 10 dan fazla medya bulunamaz!");
        }
        if (mediaType == MediaType.Video && postMedias.Any(m => m.MediaType == MediaType.Video))
        {
            throw new ArgumentException("Bir gönderide en fazla 1 video olabilir");
        }

        int orderNo = Medias.Count;

        PostMedia postImage = new(this.Id, mediaUrl, orderNo, mediaType);
        postMedias.Add(postImage);
    }
    public void SetNeighborhoodId(int neighborhoodId)
    {
        NeighborhoodId = neighborhoodId;
    }
    public void SetLocation(double? lat, double? lng)
    {
        Location = Geolocation.Create(lat, lng);
    }
    public void SetContent(string content)
    {
        Content = content;
    }
    public void SetPostType(PostType postType)
    {
        PostType = postType;
    }
    public void SetPostVisibilty(PostVisibilty postVisibilty)
    {
        PostVisibilty = postVisibilty;
    }
    public void SetReadableAddress(string? address)
    {
        ReadableAddress = address;
    }
}
