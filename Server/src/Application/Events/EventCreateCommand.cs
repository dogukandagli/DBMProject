using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Posts.Commands;
using Application.Services;
using Domain.Events;
using Domain.Events.Enums;
using Domain.Events.Repositories;
using Domain.Shared;
using Domain.Shared.ValueObjects;
using FluentValidation;
using GenericFileService.Files;
using MediatR;
using Microsoft.AspNetCore.Http;
using TS.Result;

namespace Application.Events;

public sealed record EventCreateCommand : IRequest<Result<string>>, IVerifiedUserRequest
{
    public string Title { get; init; } = default!;
    public string? Description { get; init; }
    public DateTimeOffset EventStartDate { get; init; }
    public DateTimeOffset? EventEndDate { get; init; }
    public IFormFile? CoverPhoto { get; init; } = default!;
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public int? Capacity { get; init; }
    public decimal? Price { get; init; }
    public EventVisibility EventVisibility { get; init; } = EventVisibility.NeighborsOnly;
}

public sealed class EventCreateCommandValidator : AbstractValidator<EventCreateCommand>
{
    public EventCreateCommandValidator()
    {
        RuleFor(e => e.Title)
            .NotEmpty().WithMessage("Etkinlik başlığı boş olamaz.")
            .MaximumLength(100).WithMessage("Etkinlik başlığı maksimum 100 kelime olabilir.");

        RuleFor(e => e.Description)
            .MaximumLength(1000).WithMessage("Etkinlik açıklaması maksimum 1000 kelime olabilir.");

        RuleFor(e => e.EventStartDate)
            .NotEmpty().WithMessage("Etkinlik tarihi boş olamaz.")
            .GreaterThan(DateTime.UtcNow).WithMessage("Geçmiş bir tarihe etkinlik planlayamazsınız.");


        RuleFor(e => e.EventEndDate)
            .GreaterThan(e => e.EventStartDate)
            .WithMessage("Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.");

        When(p => p.CoverPhoto != null, () =>
        {
            RuleFor(p => p.CoverPhoto!.Length)
                .GreaterThan(0).WithMessage("Boş dosya yüklenemez.")
                .LessThanOrEqualTo(50 * 1024 * 1024).WithMessage("Dosya boyutu 50MB'dan büyük olamaz.");

            RuleFor(p => p.CoverPhoto!.ContentType)
                .Must(contentType =>
                    contentType.Equals("image/jpeg") ||
                    contentType.Equals("image/png") ||
                    contentType.Equals("image/jpg"))
                .WithMessage("Kapak fotoğrafı sadece .jpg veya .png formatında olabilir.");
        });

        RuleFor(p => p.Latitude)
            .NotNull().WithMessage("Lütfen Enlem (Latitude) bilgisini giriniz.")
            .InclusiveBetween(-90, 90).WithMessage("Enlem değeri -90 ile 90 arasında olmalıdır.");

        RuleFor(p => p.Longitude)
            .NotNull().WithMessage("Lütfen Boylam (Longitude) bilgisini giriniz.")
            .InclusiveBetween(-180, 180).WithMessage("Boylam değeri -180 ile 180 arasında olmalıdır.");

        RuleFor(e => e.Capacity)
            .GreaterThan(0).WithMessage("Etkinlik kapasitesi sıfırdan büyük olmalıdır.");

        RuleFor(e => e.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Etkinlik ücreti negatif olamaz.");
    }
}

internal sealed class EventCreateCommandHandler(
    IEventRepository eventRepository,
    IClaimContext claimContext) : IRequestHandler<EventCreateCommand, Result<string>>
{
    public async Task<Result<string>> Handle(EventCreateCommand request, CancellationToken cancellationToken)
    {
        int userNeighborhoodId = claimContext.GetNeighborhoodId();

        Geolocation geolocation = Geolocation.Create(request.Latitude, request.Longitude);

        Event newEvent = Event.Create(userNeighborhoodId, request.Title, request.EventStartDate, geolocation);

        if(request.Description is not null)
        {
            newEvent.SetDescription(request.Description);
        }

        if(request.EventEndDate is not null)
        {
            newEvent.SetEndTime(request.EventEndDate);
        }

        if(request.CoverPhoto is not null)
        {
            string folderName = "event-images";

            string savedFileName = FileService.FileSaveToServer(request.CoverPhoto, $"wwwroot/{folderName}/");

            newEvent.SetCoverPhoto(savedFileName);
        }

        if(request.Capacity is not null)
        {
            newEvent.SetCapacity(request.Capacity);
        }

        if(request.Price is not null)
        {
            newEvent.SetPrice(request.Price);
        }

        await eventRepository.AddAsync(newEvent);

        return "Etkinlik başarıyla oluşturuldu.";
            
    }
}
