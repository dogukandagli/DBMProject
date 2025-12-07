using Application.Common;
using Application.Posts.Interfaces;
using Application.Posts.Queries.GetUserPosts;
using Application.Services;
using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Domain.Posts;
using Domain.Users;
using Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.QueryServices;

public sealed class PostReadService(ApplicationDbContext context,
    UserManager<AppUser> userManager,
    IClaimContext claimContext
    ) : IPostReadService
{
    public async Task<PagedResult<UserPostDto>> GetUserPostsAsync(ISpecification<Post> specification, Guid targetUserId, int page, CancellationToken cancellationToken = default)
    {
        Guid viewerUserId = claimContext.GetUserId();
        bool isOwner = viewerUserId == targetUserId;

        var postQuery = SpecificationEvaluator.Default
            .GetQuery(context.Post.AsQueryable(), specification);

        var query = from post in postQuery
                    join user in userManager.Users on post.CreatedBy equals user.Id
                    join neighborhood in context.Neighborhood on user.NeighborhoodId equals neighborhood.Id
                    select new UserPostDto(
                        post.Id,
                        post.Content,
                        post.CreatedAt,
                        post.Comments.Count,
                        post.Reactions.Count,
                        post.PostVisibilty,
                        new UserDto(user.Id,
                                    user.FullName,
                                    user.ProfilePhotoUrl,
                                    neighborhood.Name),
                        post.Medias
                                .Select(pm => new PostMediaDto(
                                    pm.Id,
                                    pm.Url,
                                    pm.MediaType,
                                    pm.OrderNo
                                ))
                                .ToList(),
                        new PostCapabilitiesDto(isOwner, isOwner, post.IsCommentingEnabled)
                         );

        var items = await query.AsNoTracking().ToListAsync(cancellationToken);

        return new PagedResult<UserPostDto>(items, items.Count, page, 5);
    }
}
