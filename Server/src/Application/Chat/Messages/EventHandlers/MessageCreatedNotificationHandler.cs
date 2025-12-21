using Domain.Conversations;
using Domain.Conversations.Events;
using Domain.Conversations.Repositorues;
using Domain.Conversations.Specifications;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Chat.Messages.EventHandlers;

internal sealed class MessageCreatedNotificationHandler(
    IConversationRepository conversationRepository,
    UserManager<AppUser> userManager,
ILogger<MessageCreatedNotificationHandler> logger) : INotificationHandler<MessageCreatedEvent>
{
    public async Task Handle(MessageCreatedEvent notification, CancellationToken cancellationToken)
    {
        ConversationWithParticipantById conversationWithParticipantById = new(notification.ConversationId);
        Conversation? conversation = await conversationRepository.FirstOrDefaultAsync(conversationWithParticipantById, cancellationToken);
        if (conversation is null)
        {
            logger.LogError("Sohbet bulunumadı");
            return;
        }


        AppUser? appUser = await userManager.FindByIdAsync(notification.SenderId.ToString());


        foreach (Participant participant in conversation.Participants)
        {

        }
    }
}
