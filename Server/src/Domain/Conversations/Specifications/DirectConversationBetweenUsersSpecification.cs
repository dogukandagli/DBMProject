using Ardalis.Specification;
using Domain.Conversations.Enums;

namespace Domain.Conversations.Specifications;

public sealed class DirectConversationBetweenUsersSpecification
    : SingleResultSpecification<Conversation>
{
    public DirectConversationBetweenUsersSpecification(
        Guid userId1,
        Guid userId2)
    {
        if (userId1 == userId2)
        {
            Query.Where(_ => false);
            return;
        }

        Query
            .Where(c => c.Type == ConversationType.Direct)
            .Where(c =>
                c.Participants.Any(p => p.UserId == userId1) &&
                c.Participants.Any(p => p.UserId == userId2)
            )
            .Where(c => c.Participants.Count == 2);
    }
}

