using Domain.Abstractions;

namespace Domain.Posts;

public sealed class Comment : AuditableEntity
{
    public Guid PostId { get; set; }
    public string Content { get; set; } = default!;

    private Comment() { }

    public static Comment Create(Guid postId, string content)
    {
        if (string.IsNullOrEmpty(content))
            throw new ArgumentNullException("Yorum içeriği boş olamaz.");
        if (content.Length > 1000)
            throw new ArgumentException("Yorum çok uzun.");

        return new Comment
        {
            PostId = postId,
            Content = content
        };
    }

    public void UpdateContent(string newContent, Guid userId)
    {
        if (userId != CreatedBy)
        {
            throw new ArgumentException("Başkasının içeriğini değiştiremezsiniz!");
        }
        if (string.IsNullOrEmpty(newContent))
            throw new ArgumentNullException("Yorum içeriği boş olamaz.");

        Content = newContent;
    }
}

