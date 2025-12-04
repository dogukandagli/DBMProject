using Application.Common;
using Application.Posts;
using Ardalis.Specification;
using Domain.Posts;

namespace Application.Services;

public interface IPostQueryService
{
    Task<PagedResult<PostDto>> GetFeedAsync(
        ISpecification<Post> specification,
        CancellationToken cancellationToken = default);
}
