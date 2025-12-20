using Ardalis.Specification.EntityFrameworkCore;
using Domain.Conversations;
using Domain.Conversations.Repositorues;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

internal class ConversationRepository : RepositoryBase<Conversation>, IConversationRepository
{
    public ConversationRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
