using Application.Services;
using Domain.Posts;
using Domain.Posts.Repositories;
using MediatR;
using TS.Result;

namespace Application.Posts.Commands;

public sealed record DeletePostCommand(Guid PostId) : IRequest<Result<string>>;

internal sealed class DeletePostCommandHandler(
    IClaimContext claimContext,
    IPostRepository postRepository
    ) : IRequestHandler<DeletePostCommand, Result<string>>
{
    public async Task<Result<string>> Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        Post? post = await postRepository.GetByIdAsync(request.PostId);

        if (post is null)
        {
            return Result<string>.Failure("Gönderi bulunamadı.");
        }

        if (post.CreatedBy != userId)
        {
            return Result<string>.Failure("Bu gönderiyi silme yetkiniz bulunmamaktadır.");
        }

        post.Delete();
        await postRepository.UpdateAsync(post);

        return "Gönderi başarıyla silindi.";
    }
}