using Application.Common.Models;
using Application.Lacations;
using MediatR;
using TS.Result;

namespace WebAPI.Modules;

public static class LocationModule
{
    public static void MapLocation(this IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("/location").WithTags("Location");

        app.MapPost("/find-by-gps",
            async (ISender sender, FindNeighborhoodByGpsQuery request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<GpsVerificationResponse>>();

        app.MapPost("/reverseGeocode",
            async (ISender sender, ReverseGeocodeQuery request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<PhysicalAddressDto>>();

        app.MapPost("/autoComplete",
            async (ISender sender, AutoCompleteQuery request, CancellationToken cancellationToken) =>
            {
                var response = await sender.Send(request, cancellationToken);
                return response.IsSuccessful ? Results.Ok(response) : Results.InternalServerError(response);
            }).Produces<Result<List<AutocompleteResult>>>();
    }
}
