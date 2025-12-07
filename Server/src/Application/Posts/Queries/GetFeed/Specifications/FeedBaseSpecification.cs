using Ardalis.Specification;
using Domain.Posts;

namespace Application.Posts.Queries.GetFeed.Specifications;

public abstract class FeedBaseSpecification : Specification<Post>
{
    public void ApplyPaging(int page, int pageSize)
    {
        if (page > 0 && pageSize > 0)
        {
            Query
                .Skip((page - 1) * pageSize)
                .Take(pageSize);
        }
    }
}
