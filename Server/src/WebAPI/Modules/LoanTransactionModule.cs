using Application.LoanTransactions.Commands;
using MediatR;
using TS.Result;

namespace WebAPI.Modules;

public static class LoanTransactionModule
{
    public static void MapLoanTransaction(this IEndpointRouteBuilder builder)
    {
        var app = builder
           .MapGroup("/loanTransaction")
           .RequireRateLimiting("fixed")
           .RequireAuthorization()
           .WithTags("LoanTransaction");


        app.MapPost("generate-handover-qr",
            async (GenerateHandoverQrCommand request, ISender sender, CancellationToken cancellationToken) =>
        {
            var result = await sender.Send(request, cancellationToken);
            return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
        })
            .Produces<Result<string>>()
            .DisableAntiforgery();
        app.MapPost("scan-handover-qr",
           async (ScanHandoverQrCommand request, ISender sender, CancellationToken cancellationToken) =>
           {
               var result = await sender.Send(request, cancellationToken);
               return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
           })
           .Produces<Result<Unit>>()
           .DisableAntiforgery();

        app.MapPost("generate-return-qr",
           async (GenerateReturnQrCommand request, ISender sender, CancellationToken cancellationToken) =>
           {
               var result = await sender.Send(request, cancellationToken);
               return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
           })
           .Produces<Result<string>>()
           .DisableAntiforgery();
        app.MapPost("scan-return-qr",
           async (ScanReturnQrCommand request, ISender sender, CancellationToken cancellationToken) =>
           {
               var result = await sender.Send(request, cancellationToken);
               return result.IsSuccessful ? Results.Ok(result) : Results.InternalServerError(result);
           })
           .Produces<Result<Unit>>()
           .DisableAntiforgery();
    }
}
