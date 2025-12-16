using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Repositories;
using MediatR;
using TS.Result;

namespace Application.BorrowRequests.Commands;

public sealed record DeleteBorrowRequestCommand(
    Guid BorrowRequestId) : IRequest<Result<DeleteBorrowRequestCommandResponse>>;

public sealed record DeleteBorrowRequestCommandResponse(
    Guid BorrowRequestId);

internal sealed class DeleteBorrowRequestCommandHandler(
    IClaimContext claimContext,
    IBorrowRequestRepository borrowRequestRepository) : IRequestHandler<DeleteBorrowRequestCommand, Result<DeleteBorrowRequestCommandResponse>>
{
    public async Task<Result<DeleteBorrowRequestCommandResponse>> Handle(DeleteBorrowRequestCommand request, CancellationToken cancellationToken)
    {
        BorrowRequest? borrowRequest = await borrowRequestRepository.GetByIdAsync(request.BorrowRequestId);
        if (borrowRequest is null)
            return Result<DeleteBorrowRequestCommandResponse>.Failure("Ödünç alma isteği bulunamadı.");

        Guid currentUserId = claimContext.GetUserId();

        if (borrowRequest.BorrowerId != currentUserId)
            return Result<DeleteBorrowRequestCommandResponse>.Failure("Yetkiniz yok.");

        borrowRequest.Delete();
        await borrowRequestRepository.SaveChangesAsync();

        return new DeleteBorrowRequestCommandResponse(borrowRequest.Id);

    }
}