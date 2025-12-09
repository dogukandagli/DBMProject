using Application.Common;
using Application.Posts.Interfaces;
using Application.Posts.Queries.GetFeed.Specifications;
using Application.Posts.Queries.GetUserPosts;
using Application.Services;
using Domain.Posts.Enums;
using Domain.Posts.Repositories;
using MediatR;
using TS.Result;

namespace Application.Posts.Queries.GetFeed;

public sealed record GetFeedQuery(
    PostVisibilty PostVisibilty,
    int Page,
    int PageSize) : IRequest<Result<PagedResult<UserPostDto>>>;

internal sealed class GetFeedQueryHandler(
    IClaimContext claimContext,
    IPostRepository postRepository,
    IPostReadService postReadService
    ) : IRequestHandler<GetFeedQuery, Result<PagedResult<UserPostDto>>>
{
    public async Task<Result<PagedResult<UserPostDto>>> Handle(GetFeedQuery request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();
        int userNeighborhoodId = claimContext.GetNeighborhoodId();

        FeedBaseSpecification specification = request.PostVisibilty switch
        {
            PostVisibilty.NeighborhoodOnly => new NeighborhoodOnlyFeedSpecification(userNeighborhoodId),
            PostVisibilty.Nearby => new NeighborhoodOnlyFeedSpecification(userNeighborhoodId),
            PostVisibilty.Public => new PublicFeedSpecification(),
            _ => throw new ArgumentException("Invalid feed type")
        };

        int totalCount = await postRepository.CountAsync(specification, cancellationToken);

        specification.ApplyPaging(request.Page, request.PageSize);

        List<UserPostDto> items = await postReadService
            .GetUserPostsAsync(specification, userId, cancellationToken);

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