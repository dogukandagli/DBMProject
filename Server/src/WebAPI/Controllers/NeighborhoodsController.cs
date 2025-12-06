using Application.Neighborhoods;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NeighborhoodsController : ControllerBase
{
    private readonly IMediator _mediator;

    public NeighborhoodsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("generate-graph")]
    public async Task<IActionResult> GenerateGraph([FromBody] GenerateGraphCommand request)
    {
        var response = await _mediator.Send(request);

        return Ok(new
        {
            isSuccessful = response.IsSuccessful,
            statusCode = response.IsSuccessful ? 200 : 400,
            data = response.IsSuccessful ? response.Data : "Hata Var",
            errorMessages = response.IsSuccessful ? null : response.ErrorMessages
        });
    }

    [HttpPost("import-from-osm")]
    public async Task<IActionResult> ImportFromOsm([FromBody] ImportNeighborhoodsFromOsmCommand request)
    {
        await _mediator.Send(request);

        return Ok(new
        {
            isSuccessful = true,
            statusCode = 200,
            data = "OSM'den mahalleler import edildi",
            errorMessages = (string[]?)null
        });
    }
}
