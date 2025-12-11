using Ardalis.Specification;

namespace Domain.Posts.Specifications;

public class PostWithSpecificCommentSpec : SingleResultSpecification<Post>
{
    public PostWithSpecificCommentSpec(Guid PostId, Guid TargetCommentId)
    {
        Query
            .Where(post => post.Id == PostId)
            .Include(post => post.Comments.Where(c => c.Id == TargetCommentId));
    }
}
