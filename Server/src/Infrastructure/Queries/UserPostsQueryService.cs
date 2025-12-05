using Application.Common;
using Application.Posts.Queries.GetUserPosts;
using Application.Services;
using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Domain.Posts;
using Domain.Users;
using Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Queries;

public sealed class UserPostsQueryService(ApplicationDbContext context,
    UserManager<AppUser> userManager,
    IClaimContext claimContext
    ) : IUserPostsQueryService
{
    public async Task<PagedResult<UserPostDto>> GetUserPostsAsync(ISpecification<Post> specification, Guid targetUserId, CancellationToken cancellationToken = default)
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
                                    pm.MediaType
                                ))
                                .ToList(),
                        new PostCapabilitiesDto(isOwner, isOwner, true)
                         );

        var items = await query.AsNoTracking().ToListAsync(cancellationToken);

        return new PagedResult<UserPostDto>(items, items.Count, 1, 5);
    }
}
