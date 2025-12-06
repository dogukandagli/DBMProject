using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public interface IOsmNeighborhoodService
    {
        Task ImportDistrictsAsync(string cityName, int cityCode, CancellationToken cancellationToken = default);
        Task ImportNeighborhoodsAsync(string cityName, int cityCode, CancellationToken cancellationToken = default);
    }
}
