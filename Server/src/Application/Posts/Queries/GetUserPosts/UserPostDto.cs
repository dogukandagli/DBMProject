using Domain.Posts.Enums;

namespace Application.Posts.Queries.GetUserPosts;

public sealed record UserPostDto(
    Guid PostId,
    string Content,
    DateTimeOffset CreatedDate,
    int CommentCount,
    int ReactionCount,
    PostVisibilty PostVisibilty,
    UserDto UserDto,
    List<PostMediaDto> Medias,
    PostCapabilitiesDto PostCapabilitiesDto);
public sealed record UserDto(
    Guid UserId,
    string FullName,
    string? ProfilePhotoUrl,
    string Neighborhood);

public sealed record PostMediaDto(
    Guid MediaId,
    string Url,
    MediaType Type
);

public sealed record PostCapabilitiesDto(
    bool CanEdit, bool CanDelete, bool CanComment);