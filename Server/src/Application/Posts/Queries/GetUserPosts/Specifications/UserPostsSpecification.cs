using Ardalis.Specification;
using Domain.Posts;
using Domain.Posts.Enums;

namespace Application.Posts.Queries.GetUserPosts.Specifications;

public class UserPostsSpecification : Specification<Post>
{
    public UserPostsSpecification(Guid targetUserId,
        bool isOwner,
        int viewerNeighborhoodId
        )
    {
        Query.AsNoTracking();
        if (isOwner)
        {
            Query
                 .Where(post => post.CreatedBy == targetUserId);
        }
        else
        {
            Query
                .Where(post =>
                    post.CreatedBy == targetUserId &&
                    (
                        post.PostVisibilty == PostVisibilty.Public ||
                        (post.PostVisibilty == PostVisibilty.NeighborhoodOnly &&
                         post.NeighborhoodId == viewerNeighborhoodId)
                    )
                );
        }

        Query
            .Include(p => p.Medias)
            .OrderByDescending(post => post.CreatedAt);
    }
}
