using System.Linq.Expressions;

namespace Domain.Posts.Specifications;

public interface IPostFeedSpecification
{
    Expression<Func<Post, bool>> Criteria { get; }
    List<Func<Post, object>> Includes { get; }

    Expression<Func<Post, object>> OrderBy { get; }
    Expression<Func<Post, object>> OrderByDescending { get; }

    int Take { get; }
    int Skip { get; }
    bool IsPagingEnabled { get; }
}
