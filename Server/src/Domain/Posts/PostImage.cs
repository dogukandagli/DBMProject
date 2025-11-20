using Domain.Abstractions;

namespace Domain.Posts;

public class PostImage : Entity
{
    private PostImage() { }

    public PostImage(Guid postId, string imageUrl, int orderNo)
    {
        SetPostId(postId);
        SetImageUrl(imageUrl);
        SetOrderNo(orderNo);
    }
    public Guid PostId { get; private set; }
    public string ImageUrl { get; private set; } = default!;
    public int OrderNo { get; private set; }
    public void SetPostId(Guid postId)
    {
        PostId = postId;
    }
    public void SetImageUrl(string imageUrl)
    {
        ImageUrl = imageUrl;
    }
    public void SetOrderNo(int orderNo)
    {
        OrderNo = orderNo;
    }
}
