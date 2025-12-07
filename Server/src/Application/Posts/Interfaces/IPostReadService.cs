using Application.Posts.Queries.GetUserPosts;
using Ardalis.Specification;
using Domain.Posts;

namespace Application.Posts.Interfaces;

public interface IPostReadService
{
    Task<List<UserPostDto>> GetUserPostsAsync(
        ISpecification<Post> specification,
        Guid viewerUserId,
        CancellationToken cancellationToken = default);
}
