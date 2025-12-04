using Application.Common;
using Application.Posts.Queries.GetUserPosts.Specifications;
using Application.Services;
using MediatR;
using TS.Result;

namespace Application.Posts.Queries.GetUserPosts;

public sealed record GetUserPostsQuery(
    Guid? UserId,
    int Page,
    int PageSize) : IRequest<Result<PagedResult<PostDto>>>;

internal sealed class GetUserPostsQueryHandler(
    IClaimContext claimContext,
    IPostQueryService postQueryService
    ) : IRequestHandler<GetUserPostsQuery, Result<PagedResult<PostDto>>>
{
    public async Task<Result<PagedResult<PostDto>>> Handle(GetUserPostsQuery request, CancellationToken cancellationToken)
    {
        Guid viewerUserId = claimContext.GetUserId();

        int viewerNeighborhoodId = claimContext.GetNeighborhoodId();

        UserPostsSpecification specification = new UserPostsSpecification(
            request.UserId ?? viewerUserId,
            viewerUserId,
            viewerNeighborhoodId,
            request.Page,
            request.PageSize);

        PagedResult<PostDto> result = await postQueryService.GetFeedAsync(specification, cancellationToken);

        return result;
    }
}
