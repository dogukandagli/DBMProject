using Domain.Abstractions;
using Domain.Shared;

namespace Domain.Posts;

public sealed class Post : Entity
{
    private Post() { }
    public Post(string content,
        double latitude, double longitude, PostType? postType
        )
    {
        SetContent(content);
        SetLocation(latitude, longitude);
        SetPostType(postType);
    }
    public string Content { get; private set; } = default!;
    public Geolocation Location { get; private set; } = Geolocation.Empty;
    private readonly List<PostImage> postImages = new List<PostImage>();
    public IReadOnlyCollection<PostImage> Images => postImages.AsReadOnly();
    public PostType? PostType { get; private set; }
    public void AddImage(string imageUrl)
    {
        if (postImages.Count > 10)
        {
            throw new ArgumentException("Bir postta 10 dan fazla medya bulunamaz!");
        }
        int orderNo = postImages.Count;
        PostImage postImage = new(this.Id, imageUrl, orderNo);
        postImages.Add(postImage);
    }
    public void SetLocation(double lat, double lng)
    {
        Location = Geolocation.Create(lat, lng);
    }
    public void SetContent(string content)
    {
        Content = content;
    }
    public void SetPostType(PostType? postType)
    {
        PostType = postType;
    }
}
