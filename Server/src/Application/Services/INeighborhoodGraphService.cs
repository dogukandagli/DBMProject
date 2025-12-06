using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public interface INeighborhoodGraphService
    {
        Task GenerateGraphForCityAsync(int cityId, CancellationToken cancellationToken = default);
    }
}
