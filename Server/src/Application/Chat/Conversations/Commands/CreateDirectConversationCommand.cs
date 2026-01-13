using Application.Services;
using Domain.Conversations;
using Domain.Conversations.Repositorues;
using Domain.Conversations.Specifications;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Chat.Conversations.Commands;

public sealed record CreateDirectConversationCommand(
    Guid TargetUserId) : IRequest<Result<CreateDirectConversationCommandResponse>>;

public sealed record CreateDirectConversationCommandResponse(
    Guid ConversationId,
    Guid CurrentUserId,
    Guid TargetUserId);

internal sealed class CreateDirectConversationCommandHandler(
    UserManager<AppUser> userManager,
    IConversationRepository conversationRepository,
    IClaimContext claimContext
    ) : IRequestHandler<CreateDirectConversationCommand, Result<CreateDirectConversationCommandResponse>>
{
    public async Task<Result<CreateDirectConversationCommandResponse>> Handle(CreateDirectConversationCommand request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();
        AppUser? currentUser = await userManager.FindByIdAsync(currentUserId.ToString());
        if (currentUser is null)
            return Result<CreateDirectConversationCommandResponse>.Failure("Kullanıcı bulunamadı.");

        AppUser? targetUser = await userManager.FindByIdAsync(request.TargetUserId.ToString());
        if (targetUser is null)
            return Result<CreateDirectConversationCommandResponse>.Failure("Sohbet açılıcak kullanıcı bulunamadı.");

        if (currentUser.NeighborhoodId != targetUser.NeighborhoodId)
            return Result<CreateDirectConversationCommandResponse>.Failure("Aynı mahallede bulunmadığınız kullanıcı ile sohbet başlatamazsınız.");

        DirectConversationBetweenUsersSpecification directConversationBetweenUsersSpecification = new(currentUserId, request.TargetUserId);

        Conversation? existingConversation = await conversationRepository.FirstOrDefaultAsync(directConversationBetweenUsersSpecification, cancellationToken);
        if (existingConversation is not null)
        {
            return new CreateDirectConversationCommandResponse(existingConversation.Id, currentUserId, request.TargetUserId);
        }

        Conversation conversation = Conversation.CreateDirect(currentUserId, request.TargetUserId);
        await conversationRepository.AddAsync(conversation, cancellationToken);

        return new CreateDirectConversationCommandResponse(conversation.Id, currentUserId, request.TargetUserId);
    }
}
