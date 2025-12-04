using Domain.Abstractions;
using Domain.Posts.Enums;
using Domain.Shared;

namespace Domain.Posts;

public sealed class Post : AggregateRoot
{
    private readonly List<PostMedia> postMedias = new List<PostMedia>();
    private readonly List<Comment> comments = new List<Comment>();
    public int NeighborhoodId { get; private set; }
    public string Content { get; private set; } = default!;
    public Geolocation Location { get; private set; } = Geolocation.Empty;
    public PostType PostType { get; private set; }
    public PostVisibilty PostVisibilty { get; private set; }
    public string? ReadableAddress { get; private set; }

    public IReadOnlyCollection<PostMedia> Medias => postMedias.AsReadOnly();
    public IReadOnlyCollection<Comment> Comments => comments.AsReadOnly();

    private Post() { }

    public static Post Create(int neighborhoodId,
        string content,
        PostType postType,
        PostVisibilty postVisibilty)
    {
        if (string.IsNullOrEmpty(content))
            throw new ArgumentNullException("İçerik boş olamaz.");

        if (neighborhoodId < 0)
            throw new ArgumentOutOfRangeException("Geçersiz mahalle ID");

        return new Post
        {
            NeighborhoodId = neighborhoodId,
            Content = content,
            PostType = postType,
            PostVisibilty = postVisibilty,
        };
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

    public void TagLocation(Geolocation location, string ReadableAddress)
    {
        if (string.IsNullOrWhiteSpace(ReadableAddress))
            throw new ArgumentException("Konum adı boş olamaz");

        Location = Location;
    }

    public void AddComment(string commentContent)
    {
        Comment comment = Comment.Create(this.Id, commentContent);

        comments.Add(comment);
    }
}
