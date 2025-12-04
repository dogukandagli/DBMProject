using Ardalis.Specification.EntityFrameworkCore;
using Domain.Posts;
using Domain.Posts.Repositories;
using Infrastructure.Context;

namespace Infrastructure.Repositories;

internal class PostRepository : RepositoryBase<Post>, IPostRepository
{
    public PostRepository(ApplicationDbContext context) : base(context)
    {
    }
}
