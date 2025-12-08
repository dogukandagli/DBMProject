using Ardalis.Specification;
using Domain.Posts.Enums;

namespace Domain.Posts.Specifications;

public sealed class PostInteractionAllowedSpec : Specification<Post>
{
    public PostInteractionAllowedSpec(int userNeighborhoodId)
    {
        Query
            .Where(p =>
                    p.PostVisibilty == PostVisibilty.Public
                    || p.NeighborhoodId == userNeighborhoodId);
    }
}
