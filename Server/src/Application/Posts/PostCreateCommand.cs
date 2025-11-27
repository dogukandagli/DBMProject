using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Services;
using Domain.Posts;
using FluentValidation;
using GenericFileService.Files;
using GenericRepository;
using MediatR;
using Microsoft.AspNetCore.Http;
using TS.Result;

namespace Application.Posts;

public sealed record PostCreateCommand : IRequest<Result<string>>, IVerifiedUserRequest
{
    public string Content { get; init; } = default!;
    public IFormFileCollection? Files { get; init; }

    public double? Latitude { get; init; }
    public double? Longitude { get; init; }

    public PostType PostType { get; init; } = PostType.Standart;
    public PostVisibilty PostVisibilty { get; init; } = PostVisibilty.NeighborhoodOnly;
};

public sealed class PostCreateCommandValidator : AbstractValidator<PostCreateCommand>
{
    public PostCreateCommandValidator()
    {
        RuleFor(p => p.Content)
            .NotEmpty().WithMessage("Gönderi içeriği boş olamaz.")
            .MaximumLength(1000).WithMessage("Gönderi içeriği en fazla 1000 karakter olabilir.");

        When(p => p.Latitude.HasValue || p.Longitude.HasValue, () =>
        {
            RuleFor(p => p.Latitude)
                .NotNull().WithMessage("Geçerli konum giriniz.")
                .InclusiveBetween(-90, 90).WithMessage("Geçersiz Enlem değeri.");

            RuleFor(p => p.Longitude)
                .NotNull().WithMessage("Konum ekliyorsanız hem Enlem hem Boylam girmelisiniz.")
                .InclusiveBetween(-180, 180).WithMessage("Geçersiz Boylam değeri.");
        });

        When(p => p.Files != null && p.Files.Count > 0, () =>
        {
            RuleFor(p => p.Files)
            .Must(files => files!.Count <= 10)
            .WithMessage("Bir gönderiye en fazla 10 adet medya ekleyebilirsiniz.");

            RuleForEach(p => p.Files).ChildRules(file =>
            {
                file.RuleFor(f => f.Length)
                .GreaterThan(0).WithMessage("Boş dosya yüklenemez.")
                .LessThanOrEqualTo(50 * 1024 * 1024)
                    .WithMessage("Dosya boyutu 50MB'dan büyük olamaz.");

                file.RuleFor(f => f.ContentType)
                    .Must(contentType =>
                        contentType.StartsWith("image/") ||
                        contentType.StartsWith("video/"))
                    .WithMessage("Sadece resim (jpg, png) veya video (mp4) formatları desteklenir.");
            }
            );
        });

        RuleFor(p => p.PostType).IsInEnum().WithMessage("Geçersiz gönderi tipi.");
        RuleFor(p => p.PostVisibilty).IsInEnum().WithMessage("Geçersiz görünürlük ayarı.");
    }
}

internal sealed class PostCreateCommandHandler(
    IPostRepository postRepository,
    IClaimContext claimContext,
    IUnitOfWork unitOfWork,
    IMapsService mapsService
    ) : IRequestHandler<PostCreateCommand, Result<string>>
{
    public async Task<Result<string>> Handle(PostCreateCommand request, CancellationToken cancellationToken)
    {
        int userNeighborhoodId = claimContext.GetNeighborhoodId();
        string? readableAdress = null;

        if (request.Latitude is not null && request.Longitude is not null)
        {
            Result<AddressDto> adress = await mapsService.
                GetAddressFromCoordinatesAsync(request.Latitude.Value, request.Longitude.Value, cancellationToken);

            if (!adress.IsSuccessful)
            {
                return Result<string>.Failure(adress.ErrorMessages);
            }
            readableAdress = $"{adress.Data!.Street} ,{adress.Data.Neighborhood} ,{adress.Data.District} ,{adress.Data.City}";
        }


        Post post = new(userNeighborhoodId,
            request.Content,
            request.PostType,
            request.PostVisibilty,
            request.Latitude,
            request.Longitude,
            readableAdress
            );

        if (request.Files is not null)
        {
            foreach (var file in request.Files)
            {
                MediaType mediaType;
                string folderName;

                if (file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                {
                    mediaType = MediaType.Image;
                    folderName = "post-images";
                }
                else if (file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
                {
                    mediaType = MediaType.Video;
                    folderName = "post-videos";
                }
                else
                {
                    return Result<string>.Failure("Desteklenmeyen dosya türü.");
                }
                string savedFileName = FileService.FileSaveToServer(file, $"wwwroot/{folderName}/");

                post.AddMedia(savedFileName, mediaType);
            }
        }

        postRepository.Add(post);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return "Gönderi başarıyla oluşturuldu.";
    }
}