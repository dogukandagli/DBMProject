using Ardalis.Specification;
using Domain.Posts.Enums;

namespace Application.Posts.Queries.GetFeed.Specifications;

public sealed class PublicFeedSpecification : FeedBaseSpecification
{
    public PublicFeedSpecification()
    {
        Query
            .AsNoTracking()
            .Where(post =>
            post.PostVisibilty == PostVisibilty.Public)
            .Include(post => post.Medias)
            .OrderByDescending(post => post.CreatedAt);
    }
}
