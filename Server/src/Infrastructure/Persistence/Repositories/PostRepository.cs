using Ardalis.Specification.EntityFrameworkCore;
using Domain.Posts;
using Domain.Posts.Repositories;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

internal class PostRepository : RepositoryBase<Post>, IPostRepository
{
    public PostRepository(ApplicationDbContext context) : base(context)
    {
    }
}
