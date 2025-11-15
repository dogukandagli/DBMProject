using Application.Neighborhoods;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

namespace WebAPI.Controllers;

[Route("odata")]
[ApiController]
[EnableQuery]
public class MainODataController(
    ISender sender) : ODataController
{

    public static IEdmModel GetEdmModel()
    {
        ODataConventionModelBuilder builder = new();
        builder.EnableLowerCamelCase();
        builder.EntitySet<NeighborhoodDto>("neighborhoods");
        return builder.GetEdmModel();
    }
    [HttpGet("neighborhoods")]
    public async Task<IQueryable<NeighborhoodDto>> GetAllNeighborhoods(CancellationToken cancellationToken)
    {
        var response = await sender.Send(new NeighborhoodGetAllQuery(), cancellationToken);
        return response;
    }
}
