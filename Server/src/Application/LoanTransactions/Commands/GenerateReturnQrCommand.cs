using Application.Common.Interfaces;
using Application.Services;
using Domain.LoanTransactions;
using Domain.LoanTransactions.Repositories;
using Domain.Shared.ValueObjects;
using MediatR;
using TS.Result;

namespace Application.LoanTransactions.Commands;

public sealed record GenerateReturnQrCommand(
    Guid LoanTransactionId,
    double Latitude,
    double Longitude
    ) : IRequest<Result<string>>;

internal sealed class GenerateReturnQrCommandHandler(
    ILoanTransactionRepository loanTransactionRepository,
    IClaimContext claimContext,
    IQrTokenGenerator qrTokenGenerator) : IRequestHandler<GenerateReturnQrCommand, Result<string>>
{
    public async Task<Result<string>> Handle(GenerateReturnQrCommand request, CancellationToken cancellationToken)
    {
        LoanTransaction? loanTransaction = await loanTransactionRepository.GetByIdAsync(request.LoanTransactionId);
        if (loanTransaction is null)
            return Result<string>.Failure("Loan bulunamadı");

        Guid currentUserId = claimContext.GetUserId();

        if (loanTransaction.BorrowerId != currentUserId)
            return Result<string>.Failure("Bu işlem için QR kodunu sadece ödünç sahibi üretebilir.");


        Geolocation returnLocation = Geolocation.Create(request.Latitude, request.Longitude);
        string secureHash = qrTokenGenerator.Generate();

        loanTransaction.GenerateReturnQr(secureHash, returnLocation);

        await loanTransactionRepository.SaveChangesAsync();

        return secureHash;
    }
}