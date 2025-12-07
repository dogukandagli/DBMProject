using Application.Services;
using Domain.Posts;
using Domain.Posts.Repositories;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.Posts.Commands;

public sealed record ToggleCommentingCommand(
    Guid PostId,
    bool Enable) : IRequest<Result<string>>;

public class ToggleCommentingCommandValidator
    : AbstractValidator<ToggleCommentingCommand>
{
    public ToggleCommentingCommandValidator()
    {
        RuleFor(x => x.PostId)
            .NotEmpty().WithMessage("Gönderi Id zorunlu.");
    }
}

internal sealed class ToggleCommentingCommandHandler(
    IClaimContext claimContext,
    IPostRepository postRepository
    ) : IRequestHandler<ToggleCommentingCommand, Result<string>>
{
    public async Task<Result<string>> Handle(ToggleCommentingCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        Post? post = await postRepository.GetByIdAsync(request.PostId);

        if (post is null)
        {
            return Result<string>.Failure("Gönderi bulunamadı.");
        }

        if (post.CreatedBy != userId)
        {
            return Result<string>.Failure("Yalnızca gönderi sahibi yorum yapma özelliğini açıp kapatabilir.");
        }

        if (request.Enable)
        {
            post.EnableCommneting();
        }
        else
        {
            post.DisableCommenting();
        }

        await postRepository.UpdateAsync(post, cancellationToken);

        return "Gönderi yorum özelliği başarıyla değiştirilmiştir.";
    }
}