using Application.Services;
using Domain.LoanTransactions;
using Domain.LoanTransactions.Repositories;
using Domain.LoanTransactions.Specifications;
using Domain.Shared.ValueObjects;
using MediatR;
using TS.Result;

namespace Application.LoanTransactions.Commands;

public sealed record ScanHandoverQrCommand(
    string QrHash,
    double Latitude,
    double Longitude
    ) : IRequest<Result<Unit>>;

internal sealed class ScanHandoverQrCommandHandler(
    ILoanTransactionRepository loanTransactionRepository,
    IClaimContext claimContext) : IRequestHandler<ScanHandoverQrCommand, Result<Unit>>
{
    public async Task<Result<Unit>> Handle(ScanHandoverQrCommand request, CancellationToken cancellationToken)
    {
        LoanWithQrCodeByHashTokenSpec loanWithQrCodeByHashTokenSpec = new(request.QrHash);
        LoanTransaction? loanTransaction = await loanTransactionRepository
            .FirstOrDefaultAsync(loanWithQrCodeByHashTokenSpec, cancellationToken);

        if (loanTransaction is null)
            return Result<Unit>.Failure("Boyle bir transaction yok");

        Guid currentUserId = claimContext.GetUserId();
        if (loanTransaction.BorrowerId != currentUserId)
            return Result<Unit>.Failure("Bu işlemi sadece ödünç alan kişi onaylayabilir.");

        Geolocation scanLocation = Geolocation.Create(request.Latitude, request.Longitude);

        loanTransaction.ConfirmHandover(request.QrHash, scanLocation);

        await loanTransactionRepository.SaveChangesAsync();

        return Unit.Value;
    }
}
