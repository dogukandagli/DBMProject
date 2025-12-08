using Domain.Abstractions;

namespace Domain.Posts.Events;

public sealed class ReactionRemovedEvent : DomainEvent
{
    public Guid PostId { get; }
    public Guid ReactionId { get; }
    public ReactionRemovedEvent(Guid postId, Guid reactionId)
    {
        PostId = postId;
        ReactionId = reactionId;
    }
}
