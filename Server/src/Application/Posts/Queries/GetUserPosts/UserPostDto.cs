using Domain.Posts.Enums;

namespace Application.Posts.Queries.GetUserPosts;

public sealed record UserPostDto(
    Guid PostId,
    string Content,
    DateTimeOffset CreatedDate,
    DateTimeOffset? UpdateDate,
    int? CommentCount,
    int? ReactionCount,
    PostVisibilty PostVisibilty,
    UserDto? UserDto,
    List<PostMediaDto> Medias,
    PostCapabilitiesDto? PostCapabilitiesDto,
    UserInteraction? UserInteraction);
public sealed record UserDto(
    Guid UserId,
    string FullName,
    string? ProfilePhotoUrl,
    string Neighborhood);

public sealed record PostMediaDto(
    Guid MediaId,
    string Url,
    MediaType Type,
    int OrderNo
);
public sealed record UserInteraction(
    bool HasReacted,
    ReactionType? ReactionType,
    bool HasCommented
    );

public sealed record PostCapabilitiesDto(
    bool CanEdit,
    bool CanDelete,
    bool CanComment,
    bool isCommentingEnabled);