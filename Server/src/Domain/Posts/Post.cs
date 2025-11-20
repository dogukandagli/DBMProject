using Domain.Abstractions;
using Domain.Shared;

namespace Domain.Posts;

public sealed class Post : Entity
{
    private Post() { }
    public Post(
        int neighborhoodId,
        string content,
        double latitude
        , double longitude,
        PostType postType = PostType.Standart
        )
    {
        SetContent(content);
        SetLocation(latitude, longitude);
        SetPostType(postType);
        SetNeighborhoodId(neighborhoodId);
    }
    public int NeighborhoodId { get; private set; }
    public string Content { get; private set; } = default!;
    public Geolocation Location { get; private set; } = Geolocation.Empty;
    private readonly List<PostMedia> postMedias = new List<PostMedia>();
    public IReadOnlyCollection<PostMedia> Medias => postMedias.AsReadOnly();
    public PostType PostType { get; private set; } = PostType.Standart;
    public void AddImage(string imageUrl, MediaType mediaType)
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

        PostMedia postImage = new(this.Id, imageUrl, orderNo, mediaType);
        postMedias.Add(postImage);
    }
    public void SetNeighborhoodId(int neighborhoodId)
    {
        NeighborhoodId = neighborhoodId;
    }
    public void SetLocation(double lat, double lng)
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
}
