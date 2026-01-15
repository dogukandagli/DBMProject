using Application.Services;
using Domain.Conversations;
using Domain.Conversations.Events;
using Domain.Conversations.Repositorues;
using Domain.Conversations.Specifications;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Chat.Messages.EventHandlers;

public sealed class MessageCreatedEventHandler(
    UserManager<AppUser> userManager,
    ILogger<MessageCreatedEventHandler> logger,
    IChatService chatService,
    IConversationRepository conversationRepository
    ) : INotificationHandler<MessageCreatedDomainEvent>
{
    public async Task Handle(MessageCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        Message message = notification.Message;
        if (message.SenderId is null)
            return;

        AppUser? senderUser = await userManager.FindByIdAsync(message.SenderId.ToString()!);

        if (senderUser is null)
        {
            logger.LogError("Gonderen bulunamadi");
            return;
        }

        ConversationWithParticipantById conversationWithParticipantById = new(message.ConversationId);
        Conversation? conversation = await conversationRepository.FirstOrDefaultAsync(conversationWithParticipantById, cancellationToken);
        if (conversation is null)
        {
            logger.LogError("Sohbet bulunamadi");
            return;
        }

        var participants = conversation.Participants.Select(p => p.UserId);

        MessageDto messageDto = new(
            message.Id,
            message.ConversationId,
            senderUser.Id,
            senderUser.FullName,
            senderUser.ProfilePhotoUrl,
            message.Content,
            message.Type.ToString(),
            message.CreatedAt,
            message.ReadAt.HasValue,
            message.ReadAt,
            false
            );

        foreach (var userId in participants)
        {
            if (userId == message.SenderId) continue;

            await chatService.SendMessageToConversationAsync(userId, messageDto);
        }
    }
}
