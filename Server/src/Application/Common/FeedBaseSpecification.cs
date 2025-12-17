using Ardalis.Specification;

namespace Application.Common;

public abstract class FeedBaseSpecification<T> : Specification<T> where T : class
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
public abstract class FeedBaseSpecification<T, TResult> : Specification<T, TResult>
    where T : class
{
    public void ApplyPaging(int page, int pageSize)
    {
        if (page > 0 && pageSize > 0)
        {
            Query.Skip((page - 1) * pageSize)
                 .Take(pageSize);
        }
    }
}
