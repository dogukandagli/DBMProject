using Application.Posts.Interfaces;
using Application.Posts.Queries.GetUserPosts;
using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Domain.Posts;
using Domain.Users;
using Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.QueryServices;

public sealed class PostReadService(ApplicationDbContext context,
    UserManager<AppUser> userManager
    ) : IPostReadService
{
    public async Task<List<UserPostDto>> GetUserPostsAsync(
        ISpecification<Post> specification,
        Guid viewerUserId,
        CancellationToken cancellationToken = default)
    {

        var postQuery = SpecificationEvaluator.Default
            .GetQuery(context.Post.AsQueryable(), specification);

        var query = from post in postQuery
                    join user in userManager.Users on post.CreatedBy equals user.Id
                    join neighborhood in context.Neighborhood on user.NeighborhoodId equals neighborhood.Id
                    select new UserPostDto(
                    post.Id,
                    post.Content,
                    post.CreatedAt,
                    post.UpdatedAt,

                    post.Comments.Count(),
                    post.Reactions.Count(),

                    post.PostVisibilty,

                    new UserDto(
                        user.Id,
                        user.FullName,
                        user.ProfilePhotoUrl,
                        neighborhood.Name
                    ),

                    post.Medias
                        .Where(m => !m.IsDeleted)
                        .OrderBy(m => m.OrderNo)
                        .Select(pm => new PostMediaDto(
                            pm.Id,
                            pm.Url,
                            pm.MediaType,
                            pm.OrderNo
                        )).ToList(),

                    new PostCapabilitiesDto(
                        post.CreatedBy == viewerUserId,
                        post.CreatedBy == viewerUserId,
                        post.IsCommentingEnabled,
                        post.IsCommentingEnabled
                    ),

                    new UserInteraction(
                        post.Reactions.Any(r => r.CreatedBy == viewerUserId),
                        post.Reactions
                            .Where(r => r.CreatedBy == viewerUserId)
                            .Select(r => r.Type)
                            .FirstOrDefault(),
                        post.Comments.Any(c => c.CreatedBy == viewerUserId)
                    )
                );

        return await query.ToListAsync(cancellationToken);
    }

}
