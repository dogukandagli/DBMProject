using Ardalis.Specification;

namespace Domain.Conversations.Specifications;

public sealed class ConversationWithParticipantById : SingleResultSpecification<Conversation>
{
    public ConversationWithParticipantById(Guid conversationId)
    {
        Query
            .Where(c => c.Id == conversationId)
            .Include(c => c.Participants);
    }
}
