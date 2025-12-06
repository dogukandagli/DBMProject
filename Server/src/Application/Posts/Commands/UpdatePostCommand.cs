using Application.Services;
using Domain.Posts;
using Domain.Posts.Enums;
using Domain.Posts.Repositories;
using Domain.Shared;
using FluentValidation;
using GenericFileService.Files;
using GenericRepository;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using TS.Result;

namespace Application.Posts.Commands;

public sealed record UpdatePostCommand : IRequest<Result<string>>
{
    public Guid PostId { get; init; }
    public string Content { get; init; } = default!;
    public PostVisibilty PostVisibilty { get; init; }
    public PostType PostType { get; init; }
    public string? MediaOrder { get; init; }
    public IFormFileCollection? Files { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public string? FormattedAddress { get; init; }
}

public sealed record MediaOrderItem(string Type, Guid? MediaId, string MediaType);

public sealed class UpdatePostCommandValidator : AbstractValidator<UpdatePostCommand>
{
    public UpdatePostCommandValidator()
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

public sealed class UpdatePostCommandHandler(
    IPostRepository postRepository,
    IClaimContext claimContext,
    IUnitOfWork unitOfWork) : IRequestHandler<UpdatePostCommand, Result<string>>
{
    public async Task<Result<string>> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        Post? post = await postRepository.GetByIdAsync(request.PostId);

        if (post is null)
        {
            return Result<string>.Failure("Gönderi bulunamadı.");
        }

        Guid userId = claimContext.GetUserId();
        if (post.CreatedBy != userId)
        {
            return Result<string>.Failure("Yalnızca gönderi sahibi gönderide değişiklik yapabilir.");
        }

        post.UpdateContent(request.Content, request.PostType, request.PostVisibilty);

        Geolocation geolocation = Geolocation.Empty;
        string? formattedAddress = string.Empty;
        if (request.Latitude.HasValue && request.Longitude.HasValue)
        {
            geolocation = Geolocation.Create(request.Latitude, request.Longitude);
            formattedAddress = request.FormattedAddress;
        }
        post.ChangeLocation(geolocation, formattedAddress);

        var mediaOrderItems = string.IsNullOrWhiteSpace(request.MediaOrder)
            ? new List<MediaOrderItem>()
            : JsonSerializer.Deserialize<List<MediaOrderItem>>(request.MediaOrder)
              ?? new List<MediaOrderItem>();

        List<Guid> incomingExistingIds = mediaOrderItems
                                              .Where(m => m.MediaId.HasValue && m.Type == "existing")
                                              .Select(m => m.MediaId!.Value)
                                              .ToList();

        var removedMedias = post.RemoveMediasExcept(incomingExistingIds);

        int fileIndex = 0;
        int sortIndex = 1;

        foreach (MediaOrderItem item in mediaOrderItems)
        {
            if (item.Type == "existing" && item.MediaId.HasValue)
            {
                post.ChangeMediaOrderNo(item.MediaId.Value, sortIndex);
            }
            else if (item.Type == "new")
            {
                if (request.Files is not null && fileIndex < request.Files.Count)
                {
                    var file = request.Files[0];

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

                    post.AddMedia(folderName, mediaType, sortIndex);
                    fileIndex++;
                }
            }
            sortIndex++;
        }
    }

}
