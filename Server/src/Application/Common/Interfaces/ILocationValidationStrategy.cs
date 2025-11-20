using TS.Result;

namespace Application.Common.Interfaces;

public interface ILocationValidationStrategy
{
    Task<Result<bool>> ValidateAsync(int userNeighborhoodId, int targetNeighborhoodId);
}
