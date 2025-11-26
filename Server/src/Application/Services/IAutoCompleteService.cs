using Application.Common.Models;

namespace Application.Services;

public interface IAutoCompleteService
{
    Task<List<AutocompleteResult>> GetAutocompletePredictionsAsync(
        string query, string sessionToken, CancellationToken cancellationToken = default);
}
