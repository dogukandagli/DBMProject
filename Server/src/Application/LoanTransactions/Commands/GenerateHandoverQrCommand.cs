using Application.Common.Interfaces;
using Application.Services;
using Domain.LoanTransactions;
using Domain.LoanTransactions.Repositories;
using Domain.Shared.ValueObjects;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.LoanTransactions.Commands;

public sealed record GenerateHandoverQrCommand(
    Guid LoanTransactionId,
    double Latitude,
    double Longitude) : IRequest<Result<string>>;

public sealed class GenerateHandoverQrCommandValidator : AbstractValidator<GenerateHandoverQrCommand>
{
    public GenerateHandoverQrCommandValidator()
    {
        RuleFor(x => x.LoanTransactionId)
            .NotEmpty()
            .WithMessage("LoanTransactionId boş olamaz.");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90)
            .WithMessage("Latitude -90 ile 90 arasında olmalıdır.");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180)
            .WithMessage("Longitude -180 ile 180 arasında olmalıdır.");

        RuleFor(x => x)
            .Must(x => !(x.Latitude == 0 && x.Longitude == 0))
            .WithMessage("Koordinat (0,0) olamaz.");
    }
}

internal sealed class GenerateHandoverQrCommandHandler(
    ILoanTransactionRepository loanTransactionRepository,
    IClaimContext claimContext,
    IQrTokenGenerator qrTokenGenerator) : IRequestHandler<GenerateHandoverQrCommand, Result<string>>
{
    public async Task<Result<string>> Handle(GenerateHandoverQrCommand request, CancellationToken cancellationToken)
    {
        LoanTransaction? loanTransaction = await loanTransactionRepository.GetByIdAsync(request.LoanTransactionId);
        if (loanTransaction is null)
            return Result<string>.Failure("Loan bulunamdı");

        Guid currentUserId = claimContext.GetUserId();

        if (loanTransaction.LenderId != currentUserId)
            return Result<string>.Failure("Bu işlem için QR kodunu sadece ürün sahibi üretebilir.");

        string secureHash = qrTokenGenerator.Generate();

        Geolocation lenderLocation = Geolocation.Create(request.Latitude, request.Longitude);

        loanTransaction.GenerateHandoverQr(secureHash, lenderLocation);

        await loanTransactionRepository.SaveChangesAsync();

        return secureHash;
    }
}
