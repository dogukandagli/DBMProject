using Domain.Posts;
using Domain.Posts.Repositories;
using GenericRepository;
using Infrastructure.Context;

namespace Infrastructure.Repositories;

internal class PostRepository : Repository<Post, ApplicationDbContext>, IPostRepository
{
    public PostRepository(ApplicationDbContext context) : base(context)
    {
    }
}
