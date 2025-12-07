using Application.Common;
using Application.Posts.Interfaces;
using Application.Posts.Queries.GetUserPosts.Specifications;
using Application.Services;
using MediatR;
using TS.Result;

namespace Application.Posts.Queries.GetUserPosts;

public sealed record GetUserPostsQuery(
    Guid? UserId,
    int Page,
    int PageSize) : IRequest<Result<PagedResult<UserPostDto>>>;

internal sealed class GetUserPostsQueryHandler(
    IClaimContext claimContext,
    IPostReadService userPostsQueryService
    ) : IRequestHandler<GetUserPostsQuery, Result<PagedResult<UserPostDto>>>
{
    public async Task<Result<PagedResult<UserPostDto>>> Handle(GetUserPostsQuery request, CancellationToken cancellationToken)
    {
        Guid viewerUserId = claimContext.GetUserId();

        int viewerNeighborhoodId = claimContext.GetNeighborhoodId();

        Guid targetUserId = request.UserId ?? viewerUserId;

        UserPostsSpecification specification = new UserPostsSpecification(
            targetUserId,
            viewerUserId,
            viewerNeighborhoodId,
            request.Page,
            request.PageSize);

        PagedResult<UserPostDto> result = await userPostsQueryService.GetUserPostsAsync(specification, targetUserId, request.Page, cancellationToken);

        return result;
    }
}
