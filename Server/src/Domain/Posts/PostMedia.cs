using Domain.Abstractions;

namespace Domain.Posts;

public class PostMedia : Entity
{
    private PostMedia() { }

    public PostMedia(Guid postId, string url, int orderNo, MediaType mediaType)
    {
        SetPostId(postId);
        SetImageUrl(url);
        SetOrderNo(orderNo);
        SetMediaType(mediaType);
    }
    public Guid PostId { get; private set; }
    public string Url { get; private set; } = default!;
    public int OrderNo { get; private set; }
    public MediaType MediaType { get; private set; }

    public void SetPostId(Guid postId)
    {
        PostId = postId;
    }
    public void SetImageUrl(string imageUrl)
    {
        Url = imageUrl;
    }
    public void SetOrderNo(int orderNo)
    {
        OrderNo = orderNo;
    }
    public void SetMediaType(MediaType mediaType)
    {
        MediaType = mediaType;
    }
}
