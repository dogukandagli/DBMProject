using Application.Common;
using Ardalis.Specification;
using Domain.Posts;

namespace Application.Posts.Queries.Comments.GetComments;

public sealed class CommentsByPostIdSpec : FeedBaseSpecification<Comment>
{
    public CommentsByPostIdSpec(Guid PostId)
    {
        Query
            .AsNoTracking()
            .Where(comment => comment.PostId == PostId)
            .OrderByDescending(c => c.CreatedAt);
    }
}

