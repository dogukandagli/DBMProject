using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Modules;

public static class AdminModule
{
    public static void MapAdmin(this IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("/admin")
                         .WithTags("Admin")
                         .RequireAuthorization(policy => policy.RequireRole("Admin"));

        // POST /admin/locations/cities/{cityId}/generate-graph
        app.MapPost("/locations/cities/{cityId:int}/generate-graph",
            async ([FromRoute] int cityId,
                   INeighborhoodGraphService graphService,
                   CancellationToken ct) =>
            {
                await graphService.GenerateGraphForCityAsync(cityId, ct);

                return Results.Ok(new
                {
                    message = $"CityId={cityId} için komşuluk grafı tetiklendi."
                });
            });
    }
}
