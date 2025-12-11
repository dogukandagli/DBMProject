using Ardalis.Specification;

namespace Application.Posts.Queries.GetFeed.Specifications;

public sealed class NeighborhoodOnlyFeedSpecification : FeedBaseSpecification
{
    public NeighborhoodOnlyFeedSpecification(int userNeighborhoodId)
    {
        Query
            .AsNoTracking()
            .Where(post => post.NeighborhoodId == userNeighborhoodId)
            .Include(post => post.Medias)
            .OrderByDescending(post => post.CreatedAt);
    }
}
