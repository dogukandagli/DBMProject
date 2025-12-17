using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Repositories;
using Domain.BorrowRequests.Specifications;
using MediatR;
using TS.Result;

namespace Application.BorrowRequests.Commands;

public sealed record CancelOfferCommand(
    Guid BorrowRequestId,
    Guid OfferId) : IRequest<Result<string>>;

internal sealed class CancelOfferCommandHandler(
    IClaimContext claimContext,
    IBorrowRequestRepository borrowRequestRepository) : IRequestHandler<CancelOfferCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CancelOfferCommand request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        BorrowRequestWithOffersById borrowRequestWithOffersById = new(request.BorrowRequestId);
        BorrowRequest? borrowRequest = await borrowRequestRepository
            .FirstOrDefaultAsync(borrowRequestWithOffersById, cancellationToken);
        if (borrowRequest is null)
            return Result<string>.Failure("Ödünç isteği bulunamadı");

        borrowRequest.CancelOffer(request.OfferId, currentUserId);

        await borrowRequestRepository.SaveChangesAsync();
        return "Teklifiniz iptal edildi.";
    }
}