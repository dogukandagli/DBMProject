using Ardalis.Specification;
using Domain.Posts;
using Domain.Posts.Enums;

namespace Application.Posts.Queries.GetUserPosts.Specifications;

public sealed class UserPostsSpecification : Specification<Post>
{
    public UserPostsSpecification(Guid targetUserId,
        Guid? viewerUserId,
        int viewerNeighborhoodId,
        int page,
        int pageSize)
    {
        if (viewerUserId.HasValue && targetUserId == viewerUserId.Value)
        {
            Query.Where(post => post.CreatedBy == targetUserId)
                 .Include(nameof(Post.Medias))
                 .OrderByDescending(post => post.CreatedAt)
                 .Skip((page - 1) * pageSize)
                 .Take(pageSize)
                 .AsNoTracking();
        }
        else
        {
            Query
                .Where(post => post.CreatedBy == targetUserId &&
                (post.PostVisibilty == PostVisibilty.Public) ||
                (post.PostVisibilty == PostVisibilty.NeighborhoodOnly &&
                post.NeighborhoodId == viewerNeighborhoodId))
                .Include(nameof(Post.Medias))
                .OrderByDescending(post => post.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking();
        }
    }
}
