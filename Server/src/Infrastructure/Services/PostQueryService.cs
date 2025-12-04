using Application.Common;
using Application.Posts;
using Application.Services;
using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Domain.Posts;
using Domain.Users;
using Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public sealed class PostQueryService(ApplicationDbContext context,
    UserManager<AppUser> userManager
    ) : IPostQueryService
{
    public async Task<PagedResult<PostDto>> GetFeedAsync(ISpecification<Post> specification, CancellationToken cancellationToken = default)
    {
        var postQuery = SpecificationEvaluator.Default
            .GetQuery(context.Post.AsQueryable(), specification);

        var query = from post in postQuery
                    join user in userManager.Users on post.CreatedBy equals user.Id
                    join neighborhood in context.Neighborhood on user.NeighborhoodId equals neighborhood.Id
                    select new PostDto(
                        post.Id, post.Content,
                        post.CreatedAt,
                        post.Comments.Count,
                        post.Reactions.Count,
                        post.PostVisibilty,
                        neighborhood.Name,
                        new UserDto(user.Id,
                                    user.FirstName.Value,
                                    user.LastName.Value,
                                    user.FullName,
                                    user.ProfilePhotoUrl),
                        post.Medias
                                .Select(pm => new PostMediaDto(
                                    pm.Id,
                                    pm.Url,
                                    pm.MediaType
                                ))
                                .ToList()
                         );

        var items = await query.AsNoTracking().ToListAsync(cancellationToken);

        return new PagedResult<PostDto>(items, items.Count, 0, 0);
    }
}
