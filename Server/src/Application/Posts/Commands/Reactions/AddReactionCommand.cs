using Application.Common.Interfaces;
using Application.Services;
using Ardalis.Specification;
using Domain.Posts;
using Domain.Posts.Enums;
using Domain.Posts.Repositories;
using Domain.Posts.Specifications;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.Posts.Commands.Reactions;

public sealed record AddReactionCommand(
    Guid PostId,
    ReactionType ReactionType = ReactionType.Like) : IRequest<Result<string>>, IVerifiedUserRequest;

public sealed class AddReactionCommandValidator : AbstractValidator<AddReactionCommand>
{
    public AddReactionCommandValidator()
    {
        RuleFor(p => p.PostId)
            .NotEmpty().WithMessage("Post Id is requried");
        RuleFor(p => p.ReactionType)
            .IsInEnum().WithMessage("Invalid reaction type");
    }
}

public class AddReactionCommandHandler(
    IClaimContext claimContext,
    IPostRepository postRepository) : IRequestHandler<AddReactionCommand, Result<string>>
{
    public async Task<Result<string>> Handle(AddReactionCommand request, CancellationToken cancellationToken)
    {
        PostWithReactionsByIdSpec postWithReactionsByIdSpec = new PostWithReactionsByIdSpec(request.PostId);
        Post? post = await postRepository.FirstOrDefaultAsync(postWithReactionsByIdSpec, cancellationToken);

        if (post is null)
            return Result<string>.Failure("Gönderi bulunamadı.");

        Guid currentUserId = claimContext.GetUserId();
        int currrentUserneighborhoodId = claimContext.GetNeighborhoodId();

        Specification<Post> postInteractionAllowed = new PostInteractionAllowedSpec(currrentUserneighborhoodId);

        if (!postInteractionAllowed.IsSatisfiedBy(post))
        {
            return Result<string>.Failure("Bu gönderiye tepki bırakamazsınız.");
        }

        post.AddReaction(currentUserId, request.ReactionType);

        await postRepository.SaveChangesAsync(cancellationToken);

        return "Tepki eklendi";
    }
}