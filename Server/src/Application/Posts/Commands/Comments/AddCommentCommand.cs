using Application.Services;
using Domain.Posts;
using Domain.Posts.Repositories;
using Domain.Posts.Specifications;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.Posts.Commands.Comments;

public sealed record AddCommentCommand(
    Guid PostId,
    string Content
    ) : IRequest<Result<string>>;

public sealed class AddCommentCommandValidator : AbstractValidator<AddCommentCommand>
{
    public AddCommentCommandValidator()
    {
        RuleFor(post => post.PostId)
            .NotEmpty().WithMessage("Post Id boş olamaz");
        RuleFor(post => post.Content)
            .NotEmpty().WithMessage("İçerik boş olamaz.")
            .MaximumLength(500).WithMessage("İçerik 500 karakterden uzun olamaz.");
    }
}

internal sealed class AddCommentCommandHandler(
    IPostRepository postRepository,
    IClaimContext claimContext
    ) : IRequestHandler<AddCommentCommand, Result<string>>
{
    public async Task<Result<string>> Handle(AddCommentCommand request, CancellationToken cancellationToken)
    {
        Post? post = await postRepository.GetByIdAsync(request.PostId, cancellationToken);
        if (post is null)
            return Result<string>.Failure("Gönderi bulunamadı.");

        int currrentUserneighborhoodId = claimContext.GetNeighborhoodId();

        PostInteractionAllowedSpec postInteractionAllowedSpec = new PostInteractionAllowedSpec(currrentUserneighborhoodId);
        if (!postInteractionAllowedSpec.IsSatisfiedBy(post))
            return Result<string>.Failure("Bu gönderiye yorum yapamazsınız.");

        post.AddComment(request.Content);

        await postRepository.SaveChangesAsync(cancellationToken);

        return "Yorumunuz başarıyla eklendi.";
    }
}