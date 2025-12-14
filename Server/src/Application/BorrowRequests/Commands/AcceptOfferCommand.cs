using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Repositories;
using Domain.BorrowRequests.Specifications;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.BorrowRequests.Commands;

public sealed record AcceptOfferCommand(
    Guid BorrowRequestId,
    Guid OfferId) : IRequest<Result<string>>;

public sealed class AcceptOfferCommandValidator : AbstractValidator<AcceptOfferCommand>
{
    public AcceptOfferCommandValidator()
    {
        RuleFor(x => x.BorrowRequestId)
            .NotEmpty().WithMessage("BorrowRequestId zorunludur.");
        RuleFor(x => x.OfferId)
            .NotEmpty().WithMessage("OfferId zorunludur.");
    }
}

internal sealed class AcceptOfferCommandHandler(
    IClaimContext claimContext,
    IBorrowRequestRepository borrowRequestRepository) : IRequestHandler<AcceptOfferCommand, Result<string>>
{
    public async Task<Result<string>> Handle(AcceptOfferCommand request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        BorrowRequestWithOffersById borrowRequestWithOffersById = new(request.BorrowRequestId);
        BorrowRequest? borrowRequest = await borrowRequestRepository.FirstOrDefaultAsync(borrowRequestWithOffersById, cancellationToken);
        if (borrowRequest is null)
            return Result<string>.Failure("Ödünç alma isteği bulunamadı.");

        if (borrowRequest.BorrowerId != currentUserId)
            return Result<string>.Failure("Bu teklifi kabbul etme yetkiniz yok.");

        borrowRequest.AcceptOffer(request.OfferId);

        await borrowRequestRepository.SaveChangesAsync();
        return "Teklif kabul edildi.";
    }
}