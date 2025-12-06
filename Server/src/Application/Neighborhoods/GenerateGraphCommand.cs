using MediatR;

namespace Application.Neighborhoods
{
    public sealed class GenerateGraphCommand : IRequest<GenerateGraphCommandResponse>
    {
        public int CityId { get; set; }
    }

    public sealed class GenerateGraphCommandResponse
    {
        public bool IsSuccessful { get; set; }
        public object? Data { get; set; }
        public List<string>? ErrorMessages { get; set; }
    }
}
