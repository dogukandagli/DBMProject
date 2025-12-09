using Application.Common;
using Application.Posts.Queries.Comments.GetComments;

namespace Application.Posts.Interfaces;

public interface ICommentReadService
{

    Task<PagedResult<PostCommentDto>> GetPostCommentsAsync(
            CommentsByPostIdSpec specification,
            Guid currentUserId,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default);
}