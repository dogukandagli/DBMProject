using Application.Common;
using Application.Posts.Interfaces;
using Application.Services;
using MediatR;
using TS.Result;

namespace Application.Posts.Queries.Comments.GetComments;

public sealed record GetPostCommentsQuery(
    Guid PostId,
    int Page,
    int PageSize) : IRequest<Result<PagedResult<PostCommentDto>>>;

internal sealed class GetPostCommentsQueryHandler(
    IClaimContext claimContext,
    ICommentReadService commentReadService
    ) : IRequestHandler<GetPostCommentsQuery, Result<PagedResult<PostCommentDto>>>
{
    public async Task<Result<PagedResult<PostCommentDto>>> Handle(GetPostCommentsQuery request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        CommentsByPostIdSpec specification = new CommentsByPostIdSpec(request.PostId);

        PagedResult<PostCommentDto> comments = await commentReadService
            .GetPostCommentsAsync(specification,
            currentUserId,
            request.Page,
            request.PageSize,
            cancellationToken);

        return comments;
    }
}