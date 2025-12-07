using Ardalis.Specification;
using Domain.Posts;

namespace Application.Posts.Queries.GetFeed.Specifications;

public sealed class NeighborhoodFeedSpecification : Specification<Post>
{
    public NeighborhoodFeedSpecification(int neighborhood, int page, int pageSize)
    {
        Query
            .Where(post => post.NeighborhoodId == neighborhood)
            .Include(nameof(Post.Medias))
            .OrderByDescending(post => post.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking();
    }
}
