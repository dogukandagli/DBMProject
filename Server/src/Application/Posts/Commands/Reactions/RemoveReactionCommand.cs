using Application.Services;
using Domain.Posts;
using Domain.Posts.Repositories;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.Posts.Commands.Reactions;

public sealed record RemoveReactionCommand(
    Guid PostId) : IRequest<Result<string>>;

public sealed class RemoveReactionCommandValidator : AbstractValidator<RemoveReactionCommand>
{
    public RemoveReactionCommandValidator()
    {
        RuleFor(post => post.PostId)
            .NotEmpty().WithMessage("Post Id is required");
    }
}

internal sealed class RemoveReactionCommandHandler(
    IPostRepository postRepository,
    IClaimContext claimContext) : IRequestHandler<RemoveReactionCommand, Result<string>>
{
    public async Task<Result<string>> Handle(RemoveReactionCommand request, CancellationToken cancellationToken)
    {
        Post? post = await postRepository.GetByIdAsync(request.PostId);
        if (post is null)
            return Result<string>.Failure("Gönderi bulunumadı.");

        Guid currentUserId = claimContext.GetUserId();

        post.RemoveReaction(currentUserId);

        await postRepository.UpdateAsync(post);
        return "Tepkiniz kaldırıldı.";
    }
}