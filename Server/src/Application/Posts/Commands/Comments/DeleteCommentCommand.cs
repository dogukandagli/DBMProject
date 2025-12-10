using Application.Services;
using Domain.Posts;
using Domain.Posts.Repositories;
using Domain.Posts.Specifications;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.Posts.Commands.Comments;

public sealed record DeleteCommentCommand(
    Guid PostId,
    Guid CommentId) : IRequest<Result<Guid>>;

public class DeleteCommentCommandValidator : AbstractValidator<DeleteCommentCommand>
{
    public DeleteCommentCommandValidator()
    {
        RuleFor(x => x.PostId)
            .NotEmpty().WithMessage("Post ID is required");

        RuleFor(x => x.CommentId)
            .NotEmpty().WithMessage("Comment ID is required");
    }
}
internal sealed class DeleteCommentCommandHandler(
    IPostRepository postRepository,
    IClaimContext claimContext) : IRequestHandler<DeleteCommentCommand, Result<Guid>>
{
    public async Task<Result<Guid>> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        PostWithCommentsByIdSpec postWithCommentsByIdSpec = new PostWithCommentsByIdSpec(request.PostId);
        Post? post = await postRepository.FirstOrDefaultAsync(postWithCommentsByIdSpec, cancellationToken);
        if (post is null)
            return Result<Guid>.Failure("Gönderi bulunamadı.");

        Comment? comment = post.Comments.FirstOrDefault(c => c.Id == request.CommentId);
        if (comment is null)
            return Result<Guid>.Failure("Yorum bulunamadı");

        Guid currentUserId = claimContext.GetUserId();

        var isCommentOwner = comment.CreatedBy == currentUserId;
        var isPostOwner = post.CreatedBy == currentUserId;

        if (!isCommentOwner && !isPostOwner)
            return Result<Guid>.Failure("Bu yorumu silme izniniz yok.");

        post.DeleteComment(request.CommentId);

        await postRepository.SaveChangesAsync();
        return comment.Id;
    }
}