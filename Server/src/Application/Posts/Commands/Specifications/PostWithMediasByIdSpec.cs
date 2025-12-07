using Ardalis.Specification;
using Domain.Posts;

namespace Application.Posts.Commands.Specifications;

public sealed class PostWithMediasByIdSpec : SingleResultSpecification<Post>
{
    public PostWithMediasByIdSpec(Guid postId)
    {
        Query
            .Where(post => post.Id == postId)
            .Include(post => post.Medias)
            ;
    }
}
