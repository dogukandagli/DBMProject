using Domain.Abstractions;

namespace Domain.Posts.Events;

public sealed class CommentRemovedEvent : DomainEvent
{
    public Guid PostId { get; set; }
    public Guid CommentId { get; set; }
    public DateTimeOffset DeleteAt { get; set; }
    public CommentRemovedEvent(Guid postId, Guid commentId, DateTimeOffset deleteAt)
    {
        PostId = postId;
        CommentId = commentId;
        DeleteAt = deleteAt;
    }
}
