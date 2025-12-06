using Application.Neighborhoods;
using Application.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Neighborhoods
{
    public sealed class GenerateGraphCommandHandler
        : IRequestHandler<GenerateGraphCommand, GenerateGraphCommandResponse>
    {
        private readonly INeighborhoodGraphService _graphService;
        private readonly ILogger<GenerateGraphCommandHandler> _logger;

        public GenerateGraphCommandHandler(
            INeighborhoodGraphService graphService,
            ILogger<GenerateGraphCommandHandler> logger)
        {
            _graphService = graphService;
            _logger = logger;
        }

        public async Task<GenerateGraphCommandResponse> Handle(
            GenerateGraphCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                await _graphService.GenerateGraphForCityAsync(request.CityId, cancellationToken);

                return new GenerateGraphCommandResponse
                {
                    IsSuccessful = true,
                    Data = new
                    {
                        Message = "Graph generation tetiklendi.",
                        request.CityId
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Graph generate sırasında hata. CityId={CityId}", request.CityId);

                return new GenerateGraphCommandResponse
                {
                    IsSuccessful = false,
                    ErrorMessages = new List<string> { ex.Message }
                };
            }
        }
    }
}
