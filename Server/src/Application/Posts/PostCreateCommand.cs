using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Services;
using Domain.Posts;
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
                string savedFileName = FileService.FileSaveToServer(file, $"wwwroot/{folderName}");

                post.AddMedia(savedFileName, mediaType);
            }
        }

        postRepository.Add(post);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return "Gönderi başarıyla oluşturuldu.";

    }
}