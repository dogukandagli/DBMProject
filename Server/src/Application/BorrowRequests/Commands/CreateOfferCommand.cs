using Application.Services;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Enums;
using Domain.BorrowRequests.Repositories;
using Domain.Shared.ValueObjects;
using FluentValidation;
using GenericFileService.Files;
using MediatR;
using Microsoft.AspNetCore.Http;
using TS.Result;

namespace Application.BorrowRequests.Commands;

public sealed record CreateOfferCommand : IRequest<Result<string>>
{
    public Guid BorrowRequestId { get; init; }
    public string Description { get; init; } = default!;
    public Condition Condition { get; init; }
    public HandoverMethod HandoverMethod { get; init; }
    public DateTimeOffset? AvailableStartTime { get; init; }
    public DateTimeOffset? AvailableEndTime { get; init; }
    public IFormFileCollection? Images { get; init; }
}

public sealed class CreateOfferCommandValidator : AbstractValidator<CreateOfferCommand>
{
    public CreateOfferCommandValidator()
    {
        RuleFor(x => x.BorrowRequestId)
            .NotEmpty().WithMessage("BorrowRequestId zorunludur.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage($"Açıklama en fazla 500 karakter olabilir.");

        RuleFor(x => x.Condition)
            .IsInEnum()
            .WithMessage("Durum geçersiz.");

        RuleFor(x => x.HandoverMethod)
            .IsInEnum()
            .WithMessage("HandoverMethod geçersiz.");

        When(x => x.AvailableStartTime is not null && x.AvailableEndTime is not null, () =>
        {
            RuleFor(e => e.AvailableStartTime)
            .GreaterThan(DateTime.UtcNow).WithMessage("Başlangıç zamanı gelecekte olmalıdır.");

            RuleFor(e => e.AvailableEndTime)
               .GreaterThan(e => e.AvailableStartTime)
               .WithMessage("Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.");
        });
        When(p => p.Images != null && p.Images.Count > 0, () =>
        {
            RuleFor(p => p.Images)
            .Must(files => files!.Count <= 3)
            .WithMessage("Bir gönderiye en fazla 10 adet medya ekleyebilirsiniz.");

            RuleForEach(p => p.Images).ChildRules(file =>
            {
                file.RuleFor(f => f.Length)
                .GreaterThan(0).WithMessage("Boş dosya yüklenemez.")
                .LessThanOrEqualTo(50 * 1024 * 1024)
                    .WithMessage("Dosya boyutu 50MB'dan büyük olamaz.");

                file.RuleFor(f => f.ContentType)
                    .Must(contentType =>
                        contentType.StartsWith("image/"))
                    .WithMessage("Sadece resim (jpg, png) formatları desteklenir.");
            }
            );
        });
    }
}

internal sealed class CreateOfferCommandHandler(
    IClaimContext claimContext,
    IBorrowRequestRepository borrowRequestRepository) : IRequestHandler<CreateOfferCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CreateOfferCommand request, CancellationToken cancellationToken)
    {
        var currentUserId = claimContext.GetUserId();

        BorrowRequest? borrowRequest = await borrowRequestRepository.GetByIdAsync(request.BorrowRequestId);
        if (borrowRequest is null)
            return Result<string>.Failure("Ödünç alma isteği bulunamadı.");

        List<string> imageUrls = new();

        if (request.Images is not null)
        {
            foreach (var file in request.Images)
            {

                if (file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                {
                    string savedFileName = FileService.FileSaveToServer(file, $"wwwroot/offer-images/");
                    imageUrls.Add(savedFileName);
                }
                else
                {
                    return Result<string>.Failure("Desteklenmeyen dosya türü.");
                }

            }
        }
        TimeSlot? timeSlot = null;
        if (request.AvailableStartTime is not null && request.AvailableEndTime is not null)
        {
            timeSlot = TimeSlot.Create(
                request.AvailableStartTime.Value,
                request.AvailableEndTime.Value);
        }

        borrowRequest.AddOffer(
            currentUserId,
            request.Description,
            request.Condition,
            request.HandoverMethod,
            imageUrls,
            timeSlot
            );

        await borrowRequestRepository.SaveChangesAsync();
        return "Teklifiniz başarıyla oluşturuldu.";
    }
}