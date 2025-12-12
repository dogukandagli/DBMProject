using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Repositories;
using Domain.BorrowRequests.ValueObjects;
using Domain.Shared.ValueObjects;
using Domain.Users;
using FluentValidation;
using GenericFileService.Files;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.BorrowRequests.Commands;

public sealed record CreateBorrowRequestCommand : IRequest<Result<Guid>>
{
    public string Title { get; init; } = default!;
    public string Description { get; init; } = default!;
    public string Category { get; init; } = default!;
    public IFormFile? Image
    {
        get; init;
    }
    public DateTimeOffset StartTime { get; init; }
    public DateTimeOffset EndTime { get; init; }

}

public sealed class CreateBorrowRequestCommandValidator : AbstractValidator<CreateBorrowRequestCommand>
{
    public CreateBorrowRequestCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Başlık boş olamaz.")
            .MaximumLength(20).WithMessage("Başlık 500 karakterden fazla olamaz.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Açıklama boş olamaz.")
            .MaximumLength(500).WithMessage("Açıklama 500 karakterden fazla olamaz.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Kategori boş olamaz.");

        RuleFor(e => e.StartTime)
            .GreaterThan(DateTime.UtcNow).WithMessage("Başlangıç zamanı gelecekte olmalıdır.");

        RuleFor(e => e.EndTime)
           .GreaterThan(e => e.StartTime)
           .WithMessage("Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.");

        When(x => x.Image is not null, () =>
        {
            RuleFor(x => x.Image!.ContentType)
                .Must(ct => ct.StartsWith("image/"))
                    .WithMessage("Sadece resim (jpg, png) formatları desteklenir.");
            RuleFor(x => x.Image!.Length)
                .GreaterThan(0).WithMessage("Boş dosya yüklenemez.")
                .LessThanOrEqualTo(50 * 1024 * 1024)
                    .WithMessage("Dosya boyutu 50MB'dan büyük olamaz.");
        });
    }
}

internal sealed class CreateBorrowRequestCommandHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager,
    IBorrowRequestRepository borrowRequestRepository) : IRequestHandler<CreateBorrowRequestCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(CreateBorrowRequestCommand request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        AppUser? user = await userManager.FindByIdAsync(currentUserId.ToString());
        if (user is null)
            return Result<Guid>.Failure("Kullanıcı bulunamadı.");

        string imageUrl = string.Empty;

        if (request.Image is not null)
        {
            imageUrl = FileService.FileSaveToServer(request.Image, $"wwwroot/borrowrequest-image/");
        }

        ItemSpecification itemSpecification = ItemSpecification.Create(
            request.Title,
            request.Description,
            request.Category,
            imageUrl
            );

        TimeSlot timeSlot = TimeSlot.Create(
            request.StartTime,
            request.EndTime);

        BorrowRequest borrowRequest = BorrowRequest.Create(
            user.Id,
            itemSpecification,
            timeSlot,
            user.NeighborhoodId);

        await borrowRequestRepository.AddAsync(borrowRequest, cancellationToken);
        await borrowRequestRepository.SaveChangesAsync(cancellationToken);

        return borrowRequest.Id;
    }
}