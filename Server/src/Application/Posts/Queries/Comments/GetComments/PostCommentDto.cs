namespace Application.Posts.Queries.Comments.GetComments;

public sealed record PostCommentDto(
    Guid CommentId,
    Guid PostId,
    string Content,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt,
    CommentAuthorDto CommentAuthorDto,
    CommentCapabilitiesDto CommentCapabilitiesDto
    );


public sealed record CommentAuthorDto(
    Guid UserId,
    string FullName,
    string? ProfilePhotoUrl,
    bool IsPostAuthor);

public sealed record CommentCapabilitiesDto(
    bool CanEdit,
    bool CanDelete);
