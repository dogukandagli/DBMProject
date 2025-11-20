using Application.Common.Interfaces;
using TS.Result;

namespace Application.Common.Strategies;

public class StrictLocationStrategy : ILocationValidationStrategy
{
    public Task<Result<bool>> ValidateAsync(int userNeighborhoodId, int targetNeighborhoodId)
    {
        if (userNeighborhoodId != targetNeighborhoodId)
        {
            return Task.FromResult(Result<bool>.Failure("Sadece kendi mahallenizde işlem yapabilirsiniz."));
        }
        return Task.FromResult<Result<bool>>(true);
    }
}
