using Ardalis.Specification.EntityFrameworkCore;
using Domain.Conversations;
using Domain.Conversations.Repositories;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

internal class MessageRepository : RepositoryBase<Message>, IMessageRepository
{
    public MessageRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
