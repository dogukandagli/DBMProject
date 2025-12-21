using Domain.Abstractions;

namespace Domain.Conversations;

public sealed class Participant : AuditableEntity
{
    public Guid ConversationId { get; private set; }
    public Guid UserId { get; private set; }
    public DateTimeOffset JoinedAt { get; private set; }
    public DateTimeOffset? LastReadAt { get; private set; }

    private Participant() { }

    private Participant(Guid conversationId, Guid userId, DateTimeOffset joinedAt)
    {
        ConversationId = conversationId;
        UserId = userId;
        JoinedAt = joinedAt;
    }

    public static Participant Create(Guid conversationId, Guid userId)
       => new(conversationId, userId, DateTime.UtcNow);

    public void SetLastReadAt(DateTimeOffset utc)
    {
        LastReadAt = utc;
    }
}
