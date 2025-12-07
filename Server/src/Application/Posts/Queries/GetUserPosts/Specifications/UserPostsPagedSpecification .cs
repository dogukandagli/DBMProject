using Ardalis.Specification;

namespace Application.Posts.Queries.GetUserPosts.Specifications;

public sealed class UserPostsPagedSpecification : UserPostsSpecification
{
    public UserPostsPagedSpecification(Guid targetUserId,
        bool isOwner,
        int viewerNeighborhoodId,
        int page,
        int pageSize) : base(targetUserId, isOwner, viewerNeighborhoodId)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 10;

        Query
           .Skip((page - 1) * pageSize)
           .Take(pageSize);
    }
}