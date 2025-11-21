using Application.Common.Models;
using Application.Services;
using Domain.Posts;
using GenericFileService.Files;
using GenericRepository;
using MediatR;
using Microsoft.AspNetCore.Http;
using TS.Result;

namespace Application.Posts;

public sealed record PostCreateCommand(
    string Content,
    IFormFileCollection? Files,
    double? latitude,
    double? longitude,
    PostType PostType = PostType.Standart,
    PostVisibilty PostVisibilty = PostVisibilty.NeighborhoodOnly
) : IRequest<Result<string>>;


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

        if (request.latitude is not null && request.longitude is not null)
        {
            Result<AddressDto> adress = await mapsService.
                GetAddressFromCoordinatesAsync(request.latitude.Value, request.longitude.Value, cancellationToken);

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
            request.latitude,
            request.longitude,
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