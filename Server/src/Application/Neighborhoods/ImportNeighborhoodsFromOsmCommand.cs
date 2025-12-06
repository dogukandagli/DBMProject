using MediatR;
using Application.Services;
public record ImportNeighborhoodsFromOsmCommand(string CityName, int CityCode) : IRequest;

public class ImportNeighborhoodsFromOsmCommandHandler
    : IRequestHandler<ImportNeighborhoodsFromOsmCommand>
{
    private readonly IOsmNeighborhoodService _osmNeighborhoodService;

    public ImportNeighborhoodsFromOsmCommandHandler(IOsmNeighborhoodService osmNeighborhoodService)
    {
        _osmNeighborhoodService = osmNeighborhoodService;
    }
    public async Task Handle(ImportNeighborhoodsFromOsmCommand request, CancellationToken cancellationToken)
    {
        await _osmNeighborhoodService.ImportNeighborhoodsAsync(
            request.CityName,
            request.CityCode,
            cancellationToken);
    }
}
