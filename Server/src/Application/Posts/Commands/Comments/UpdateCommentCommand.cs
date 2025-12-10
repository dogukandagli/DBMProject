using Application.Services;
using Domain.Posts;
using Domain.Posts.Repositories;
using Domain.Posts.Specifications;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.Posts.Commands.Comments;

public sealed record UpdateCommentCommand(
    Guid PostId,
    Guid CommentId,
    string CommentContent
    ) : IRequest<Result<string>>;

public sealed class UpdateCommentCommandValidator : AbstractValidator<UpdateCommentCommand>
{
    public UpdateCommentCommandValidator()
    {
        RuleFor(x => x.PostId)
           .NotEmpty().WithMessage("Post ID is required");

        RuleFor(x => x.CommentId)
            .NotEmpty().WithMessage("Comment ID is required");

        RuleFor(x => x.CommentContent)
            .NotEmpty().WithMessage("Yorum içeriği boş olamaz.")
            .MaximumLength(1000).WithMessage("Yorum içeriği 1000 karakterden fazla olamaz.");
    }
}

internal sealed class UpdateCommentCommandHandler(
    IPostRepository postRepository,
    IClaimContext claimContext) : IRequestHandler<UpdateCommentCommand, Result<string>>
{
    public async Task<Result<string>> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        PostWithSpecificCommentSpec postWithSpecificCommentSpec = new PostWithSpecificCommentSpec(request.PostId, request.CommentId);
        Post? post = await postRepository.FirstOrDefaultAsync(postWithSpecificCommentSpec, cancellationToken);
        if (post is null)
            return Result<string>.Failure("Gönderi bulunamadı.");

        Guid currentUserId = claimContext.GetUserId();

        post.UpdateComment(request.CommentId, request.CommentContent, currentUserId);

        await postRepository.SaveChangesAsync();
        return "Yorumunuz başarıyla değiştirildi.";
    }
}