using Application.Common;
using Ardalis.Specification;
using Domain.Posts;

namespace Application.Posts.Queries.GetUserPosts;

public interface IUserPostsQueryService
{
    Task<PagedResult<UserPostDto>> GetUserPostsAsync(
        ISpecification<Post> specification,
         Guid targetUserId,
         int page,
        CancellationToken cancellationToken = default);
}
