using Ardalis.Specification;

namespace Domain.Posts.Specifications;

public sealed class PostWithCommentsByIdSpec : SingleResultSpecification<Post>
{
    public PostWithCommentsByIdSpec(Guid PostId)
    {
        Query
            .Where(post => post.Id == PostId)
            .Include(post => post.Comments);
    }
}
