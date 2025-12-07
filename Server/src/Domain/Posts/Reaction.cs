using Domain.Abstractions;
using Domain.Posts.Enums;

namespace Domain.Posts;

public sealed class Reaction : AuditableEntity
{
    public Guid PostId { get; private set; }
    public ReactionType Type { get; private set; }

    private Reaction() { }

    public static Reaction Create(Guid postId, ReactionType reactionType)
    {
        return new Reaction()
        {
            PostId = postId,
            Type = reactionType
        };
    }

    public void ChangeType(ReactionType newType)
    {
        Type = newType;
    }
}
