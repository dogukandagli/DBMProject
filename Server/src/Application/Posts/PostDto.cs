using Domain.Posts.Enums;

namespace Application.Posts;

public sealed record PostDto(
    Guid PostId,
    string Content,
    DateTimeOffset CreatedDate,
    int CommentCount,
    int ReactionCount,
    PostVisibilty PostVisibilty,
    string Location,
    UserDto UserDto,
    List<PostMediaDto> Medias);
public sealed record UserDto(
    Guid UserId,
    string FirstName,
    string LastName,
    string FullName,
    string? ProfilePhotoUrl);

public sealed record PostMediaDto(
    Guid MediaId,
    string Url,
    MediaType Type
);