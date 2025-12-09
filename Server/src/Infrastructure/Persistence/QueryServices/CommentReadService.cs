using Application.Common;
using Application.Posts.Interfaces;
using Application.Posts.Queries.Comments.GetComments;
using Ardalis.Specification.EntityFrameworkCore;
using Domain.Users;
using Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Persistence.QueryServices;

public sealed class CommentReadService(
    ApplicationDbContext context,
    UserManager<AppUser> userManager) : ICommentReadService
{
    public async Task<PagedResult<PostCommentDto>> GetPostCommentsAsync(
        CommentsByPostIdSpec specification,
        Guid currentUserId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {

        var countQuery = SpecificationEvaluator.Default
            .GetQuery(context.Comment.AsQueryable(), specification);

        int totalCount = await countQuery.CountAsync(cancellationToken);

        specification.ApplyPaging(page, pageSize);

        var postCommentsQuery = SpecificationEvaluator.Default
            .GetQuery(context.Comment.AsQueryable(), specification);

        var query = from postComment in postCommentsQuery
                    join user in userManager.Users on postComment.CreatedBy equals user.Id
                    join post in context.Post on postComment.PostId equals post.Id
                    select new PostCommentDto(
                        postComment.Id,
                        postComment.PostId,
                        postComment.Content,
                        postComment.CreatedAt,
                        postComment.UpdatedAt,
                        new CommentAuthorDto(
                            user.Id
                            , user.FullName,
                            user.ProfilePhotoUrl,
                            postComment.CreatedBy == post.CreatedBy
                            ),
                        new CommentCapabilitiesDto(
                            postComment.CreatedBy == currentUserId,
                            postComment.CreatedBy == currentUserId || post.CreatedBy == currentUserId));

        var data = await query.ToListAsync(cancellationToken);

        int totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PagedResult<PostCommentDto>(
            data,
            page,
            pageSize,
            totalCount,
            totalPages);
    }

}
