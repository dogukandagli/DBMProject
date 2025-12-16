using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Repositories;
using Domain.BorrowRequests.Specifications;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.BorrowRequests.Commands;

public sealed record CancelBorrowRequestCommand(
    Guid BorrowRequestId) : IRequest<Result<string>>;

public sealed class CancelBorrowRequestCommandValidator : AbstractValidator<CancelBorrowRequestCommand>
{
    public CancelBorrowRequestCommandValidator()
    {
        RuleFor(x => x.BorrowRequestId)
            .NotEmpty().WithMessage("BorrowRequestId zorunludur.");
    }
}

internal sealed class CancelBorrowRequestCommandHandler(
    IClaimContext claimContext,
    IBorrowRequestRepository borrowRequestRepository) : IRequestHandler<CancelBorrowRequestCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CancelBorrowRequestCommand request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        BorrowRequestWithOffersById borrowRequestWithOffersById = new(request.BorrowRequestId);
        BorrowRequest? borrowRequest = await borrowRequestRepository.FirstOrDefaultAsync(borrowRequestWithOffersById, cancellationToken);
        if (borrowRequest is null)
            return Result<string>.Failure("Ödünç alma isteği bulunamadı.");

        borrowRequest.Cancel(currentUserId);

        await borrowRequestRepository.SaveChangesAsync();
        return "Ödünç isteğiniz iptal edildi.";
    }
}