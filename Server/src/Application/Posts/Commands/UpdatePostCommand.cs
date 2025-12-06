using Application.Posts.Commands.Specifications;
using Application.Posts.Queries.GetUserPosts;
using Application.Services;
using Domain.Posts;
using Domain.Posts.Enums;
using Domain.Posts.Repositories;
using Domain.Shared;
using FluentValidation;
using GenericFileService.Files;
using MediatR;
using Microsoft.AspNetCore.Http;
using TS.Result;

namespace Application.Posts.Commands;

public sealed record UpdatePostCommand : IRequest<Result<UpdatePostResponse>>
{
    public Guid PostId { get; init; }
    public string Content { get; init; } = string.Empty;
    public PostVisibilty PostVisibilty { get; init; }
    public PostType PostType { get; init; }

    public Location? Location { get; init; }

    public List<PostMediaUpdateItem> Medias { get; init; } = new();
}
public sealed record PostMediaUpdateItem
{
    public Guid? ExistingPhotoId { get; init; }
    public IFormFile? File { get; init; }
}
public sealed record Location
{
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public string FormattedAddress { get; init; } = string.Empty;
}

public sealed record UpdatePostResponse(
    UserPostDto UserPostDto);

public sealed class UpdatePostCommandValidator : AbstractValidator<UpdatePostCommand>
{
    public UpdatePostCommandValidator()
    {
        RuleFor(p => p.Content)
            .NotEmpty().WithMessage("Gönderi içeriği boş olamaz.")
            .MaximumLength(1000).WithMessage("Gönderi içeriği en fazla 1000 karakter olabilir.");

        When(p => p.Location is not null, () =>
        {
            RuleFor(p => p.Location!.Latitude)
                .NotNull().WithMessage("Geçerli konum giriniz.")
                .InclusiveBetween(-90, 90).WithMessage("Geçersiz Enlem değeri.");

            RuleFor(p => p.Location!.Longitude)
                .NotNull().WithMessage("Konum ekliyorsanız hem Enlem hem Boylam girmelisiniz.")
                .InclusiveBetween(-180, 180).WithMessage("Geçersiz Boylam değeri.");
        });

        When(p => p.Medias is { Count: > 0 }, () =>
        {
            RuleForEach(p => p.Medias!).ChildRules(media =>
            {
                media.When(m => m.File is not null, () =>
                {
                    media.RuleFor(m => m.File!.Length)
                        .GreaterThan(0).WithMessage("Boş dosya yüklenemez.")
                        .LessThanOrEqualTo(50 * 1024 * 1024)
                        .WithMessage("Dosya boyutu 50MB'dan büyük olamaz.");

                    media.RuleFor(m => m.File!.ContentType)
                        .Must(contentType =>
                            !string.IsNullOrWhiteSpace(contentType) &&
                            (contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase) ||
                             contentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase)))
                        .WithMessage("Sadece resim veya video formatındaki dosyalar desteklenir.");
                });
            });
        });

        RuleFor(p => p.PostType).IsInEnum().WithMessage("Geçersiz gönderi tipi.");
        RuleFor(p => p.PostVisibilty).IsInEnum().WithMessage("Geçersiz görünürlük ayarı.");
    }
}

public sealed class UpdatePostCommandHandler(
    IPostRepository postRepository,
    IClaimContext claimContext
  ) : IRequestHandler<UpdatePostCommand, Result<UpdatePostResponse>>
{
    public async Task<Result<UpdatePostResponse>> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var spec = new PostWithMediasByIdSpec(request.PostId);

        Post? post = await postRepository.SingleOrDefaultAsync(spec, cancellationToken);

        if (post is null)
        {
            return Result<UpdatePostResponse>.Failure("Gönderi bulunamadı.");
        }

        Guid userId = claimContext.GetUserId();
        if (post.CreatedBy != userId)
        {
            return Result<UpdatePostResponse>.Failure("Yalnızca gönderi sahibi gönderide değişiklik yapabilir.");
        }

        post.UpdateContent(request.Content, request.PostType, request.PostVisibilty);

        if (request.Location is not null)
        {
            post.ChangeLocation(
                location: Geolocation.Create(request.Location.Latitude, request.Location.Longitude),
                readableAddress: request.Location.FormattedAddress);
        }

        var medias = request.Medias ?? new List<PostMediaUpdateItem>();


        var existingMedias = post.Medias.ToList();

        var existingIdsInRequest = medias
            .Where(m => m.ExistingPhotoId.HasValue)
            .Select(m => m.ExistingPhotoId!.Value)
            .ToHashSet();

        var mediasToDelete = existingMedias
            .Where(m => !existingIdsInRequest.Contains(m.Id))
            .ToList();

        foreach (var media in mediasToDelete)
        {
            post.RemoveMedia(media.Id);
        }

        int sortIndex = 1;

        foreach (var item in medias)
        {
            if (item.ExistingPhotoId.HasValue)
            {
                var media = post.Medias.FirstOrDefault(m => m.Id == item.ExistingPhotoId.Value);

                if (media is null)
                    continue;

                post.ChangeMediaOrderNo(media.Id, sortIndex);
            }
            else if (item.File is not null)
            {
                var file = item.File;
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
                    return Result<UpdatePostResponse>.Failure("Desteklenmeyen dosya türü.");
                }
                string savedFileName = FileService.FileSaveToServer(file, $"wwwroot/{folderName}/");

                post.AddMedia(savedFileName, mediaType, sortIndex);

            }
            sortIndex++;
        }

        await postRepository.SaveChangesAsync();

        var existingMedias2 = post.Medias.ToList();


        return new UpdatePostResponse(
            new UserPostDto(
                post.Id,
                post.Content,
                post.CreatedAt,
                null,
                null,
                post.PostVisibilty,
                null,
                post.Medias
                    .Select(pm => new PostMediaDto(
                                    pm.Id,
                                    pm.Url,
                                    pm.MediaType,
                                    pm.OrderNo
                                ))
                                .ToList(),
                null
                ));
    }
}
