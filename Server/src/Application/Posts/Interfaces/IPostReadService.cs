using Application.Common;
using Application.Posts.Queries.GetUserPosts;
using Ardalis.Specification;
using Domain.Posts;

namespace Application.Posts.Interfaces;

public interface IPostReadService
{
    Task<PagedResult<UserPostDto>> GetUserPostsAsync(
        ISpecification<Post> specification,
         Guid targetUserId,
         int page,
        CancellationToken cancellationToken = default);
}
