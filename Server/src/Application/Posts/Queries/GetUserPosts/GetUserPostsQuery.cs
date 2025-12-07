using Application.Common;
using Application.Posts.Interfaces;
using Application.Posts.Queries.GetUserPosts.Specifications;
using Application.Services;
using Domain.Posts.Repositories;
using MediatR;
using TS.Result;

namespace Application.Posts.Queries.GetUserPosts;

public sealed record GetUserPostsQuery(
    Guid? UserId,
    int Page,
    int PageSize) : IRequest<Result<PagedResult<UserPostDto>>>;

internal sealed class GetUserPostsQueryHandler(
    IClaimContext claimContext,
    IPostReadService userPostsQueryService,
    IPostRepository postRepository
    ) : IRequestHandler<GetUserPostsQuery, Result<PagedResult<UserPostDto>>>
{
    public async Task<Result<PagedResult<UserPostDto>>> Handle(GetUserPostsQuery request, CancellationToken cancellationToken)
    {
        Guid viewerUserId = claimContext.GetUserId();

        int viewerNeighborhoodId = claimContext.GetNeighborhoodId();

        Guid targetUserId = request.UserId ?? viewerUserId;

        bool isOwner = viewerUserId == targetUserId;

        UserPostsSpecification userPostsPagedSpecification = new UserPostsSpecification(
            targetUserId,
            isOwner,
            viewerNeighborhoodId);

        int totalCount = await postRepository.CountAsync(userPostsPagedSpecification, cancellationToken);

        UserPostsPagedSpecification specification = new UserPostsPagedSpecification(
            targetUserId,
            isOwner,
            viewerNeighborhoodId,
            request.Page,
            request.PageSize);

        List<UserPostDto> items = await userPostsQueryService.GetUserPostsAsync(specification, viewerUserId, cancellationToken);

        var pagedResult = new PagedResult<UserPostDto>(
            items,
            request.Page,
            request.PageSize,
            totalCount,
            (int)Math.Ceiling(totalCount / (double)request.PageSize)
            );

        return pagedResult;
    }
}
