using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Repositories;
using Domain.BorrowRequests.Specifications;
using MediatR;
using TS.Result;

namespace Application.BorrowRequests.Commands;

public sealed record RejectOfferCommand(
      Guid BorrowRequestId,
    Guid OfferId) : IRequest<Result<string>>;


internal sealed class RejectOfferCommandHandler(
    IClaimContext claimContext,
    IBorrowRequestRepository borrowRequestRepository) : IRequestHandler<RejectOfferCommand, Result<string>>
{
    public async Task<Result<string>> Handle(RejectOfferCommand request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        BorrowRequestWithOffersById borrowRequestWithOffersById = new(request.BorrowRequestId);
        BorrowRequest? borrowRequest = await borrowRequestRepository.FirstOrDefaultAsync(borrowRequestWithOffersById, cancellationToken);
        if (borrowRequest is null)
            return Result<string>.Failure("Ödünç alma isteği bulunamadı.");

        if (borrowRequest.BorrowerId != currentUserId)
            return Result<string>.Failure("Bu teklifi silme yetkiniz yok.");

        borrowRequest.RejectOffer(request.OfferId);

        await borrowRequestRepository.SaveChangesAsync();
        return "Teklif red edildi.";
    }
}