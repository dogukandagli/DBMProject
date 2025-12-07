using Domain.Abstractions;
using Domain.Posts.Enums;
using Domain.Shared;

namespace Domain.Posts;

public sealed class Post : AggregateRoot
{
    private readonly List<PostMedia> _medias = new List<PostMedia>();
    private readonly List<Comment> comments = new List<Comment>();
    private readonly List<Reaction> reactions = new List<Reaction>();

    public int NeighborhoodId { get; private set; }
    public string Content { get; private set; } = default!;
    public Geolocation Location { get; private set; } = Geolocation.Empty;
    public PostType PostType { get; private set; }
    public PostVisibilty PostVisibilty { get; private set; }
    public string? ReadableAddress { get; private set; }
    public bool IsCommentingEnabled { get; private set; } = true;

    public IReadOnlyCollection<PostMedia> Medias => _medias.AsReadOnly();
    public IReadOnlyCollection<Comment> Comments => comments.AsReadOnly();
    public IReadOnlyCollection<Reaction> Reactions => reactions.AsReadOnly();

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

    public Post UpdateContent(string content, PostType postType, PostVisibilty postVisibilty)
    {
        if (string.IsNullOrEmpty(content))
            throw new ArgumentNullException("İçerik boş olamaz.");

        Content = content;
        PostType = postType;
        PostVisibilty = postVisibilty;

        return this;
    }

    public void AddMedia(string mediaUrl, MediaType mediaType, int orderNo)
    {
        if (Medias.Count > 10)
        {
            throw new ArgumentException("Bir postta 10 dan fazla medya bulunamaz!");
        }
        if (mediaType == MediaType.Video && _medias.Any(m => m.MediaType == MediaType.Video))
        {
            throw new ArgumentException("Bir gönderide en fazla 1 video olabilir");
        }

        PostMedia postMedia = new(this.Id, mediaUrl, orderNo, mediaType);
        this._medias.Add(postMedia);
    }
    public void RemoveMedia(Guid mediaId)
    {
        PostMedia? postMedia = _medias.FirstOrDefault(m => m.Id == mediaId);
        if (postMedia is null)
            return;
        _medias.Remove(postMedia);
    }

    public void ChangeMediaOrderNo(Guid mediaId, int order)
    {
        PostMedia? postMedia = _medias.FirstOrDefault(m => m.Id == mediaId);
        if (postMedia is null)
        {
            throw new ArgumentException("Medya bulunamadı");
        }

        postMedia.ChangeOrderNo(order);
    }

    public void TagLocation(Geolocation location, string ReadableAddress)
    {
        if (string.IsNullOrWhiteSpace(ReadableAddress))
            throw new ArgumentException("Konum adı boş olamaz");

        if (location == Geolocation.Empty)
        {
            throw new ArgumentException("Konum bilgisini doğru girin.");
        }

        Location = Location;
    }

    public void ChangeLocation(Geolocation location, string? readableAddress)
    {
        Location = location;
        ReadableAddress = readableAddress;
    }

    public void AddComment(string commentContent)
    {
        if (!IsCommentingEnabled)
            throw new InvalidOperationException("Yorum atma kapalı.");

        Comment comment = Comment.Create(this.Id, commentContent);

        comments.Add(comment);
    }

    public void AddReaction(Guid userId, ReactionType reactionType)
    {
        Reaction? existingReaction = reactions.FirstOrDefault(r => r.CreatedBy == userId);

        if (existingReaction is not null)
        {
            existingReaction.ChangeType(reactionType);
            return;
        }

        Reaction reaction = Reaction.Create(this.Id, reactionType);
    }

    public void DisableCommenting()
    {
        if (!IsCommentingEnabled)
            throw new InvalidOperationException("Yorumlar zaten kapalı");

        IsCommentingEnabled = false;
    }

    public void EnableCommneting()
    {
        if (IsCommentingEnabled)
            throw new InvalidOperationException("Yorumlar zaten açık");

        IsCommentingEnabled = true;
    }
}
