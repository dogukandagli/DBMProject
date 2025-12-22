namespace Domain.Conversations.Specifications;

using Ardalis.Specification;

public sealed class ConversationByRelatedEntityIdSpec
    : SingleResultSpecification<Conversation>
{
    public ConversationByRelatedEntityIdSpec(Guid relatedEntityId)
    {
        Query
            .Where(c => c.RelatedEntityId.HasValue && c.RelatedEntityId.Value == relatedEntityId)
            .AsNoTracking();
    }
}

