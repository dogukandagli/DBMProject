using Ardalis.Specification;
using Domain.Posts.Enums;

namespace Application.Posts.Queries.GetFeed.Specifications;

public sealed class NeighborhoodOnlyFeedSpecification : FeedBaseSpecification
{
    public NeighborhoodOnlyFeedSpecification(int userNeighborhoodId)
    {
        Query
            .AsNoTracking()
            .Where(post => post.NeighborhoodId == userNeighborhoodId
            && post.PostVisibilty == PostVisibilty.NeighborhoodOnly)
            .Include(post => post.Medias)
            .OrderByDescending(post => post.CreatedAt);
    }
}
