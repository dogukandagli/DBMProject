using Ardalis.Specification;

namespace Domain.Posts.Specifications;

public sealed class PostWithMediasByIdSpec : SingleResultSpecification<Post>
{
    public PostWithMediasByIdSpec(Guid postId)
    {
        Query
            .Where(post => post.Id == postId)
            .Include(post => post.Medias);
    }
}
