using Ardalis.Specification;

namespace Domain.Posts.Specifications;

public class PostWithReactionsByIdSpec : SingleResultSpecification<Post>
{
    public PostWithReactionsByIdSpec(Guid postId)
    {
        Query
            .Where(post => post.Id == postId)
            .Include(post => post.Reactions);
    }
}
