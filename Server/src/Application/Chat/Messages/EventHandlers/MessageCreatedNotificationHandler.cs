using Application.Services;
using Domain.Conversations;
using Domain.Conversations.Events;
using Domain.Conversations.Repositorues;
using Domain.Conversations.Specifications;
using Domain.Notifications;
using Domain.Notifications.Enums;
using Domain.Notifications.Repositories;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Chat.Messages.EventHandlers;

internal sealed class MessageCreatedNotificationHandler(
    IConversationRepository conversationRepository,
    UserManager<AppUser> userManager,
    INotificationRepository notificationRepository,
    INotificationService notificationService,
ILogger<MessageCreatedNotificationHandler> logger) : INotificationHandler<MessageCreatedDomainEvent>
{
    public async Task Handle(MessageCreatedDomainEvent notification, CancellationToken cancellationToken)
    {
        Message message = notification.Message;
        ConversationWithParticipantById conversationWithParticipantById = new(message.ConversationId);
        Conversation? conversation = await conversationRepository.FirstOrDefaultAsync(conversationWithParticipantById, cancellationToken);
        if (conversation is null)
        {
            logger.LogError("Sohbet bulunumadı");
            return;
        }


        if (message.SenderId is null)
            return;

        AppUser? user = await userManager.FindByIdAsync(message.SenderId.ToString()!);
        if (user is null)
        {
            logger.LogError($"{message.SenderId} id li Kullanıcı bulunamadı.");
            return;
        }

        string title = "Mesajınız var.";
        string messageText = $"{user.FullName} kişisinden mesajınız var.";

        foreach (Participant participant in conversation.Participants)
        {
            if (user.Id != participant.UserId)
            {
                Notification notification1 = new Notification(
                   participant.UserId,
                   title,
                   messageText,
                   NotificationType.General,
                   message.ConversationId);

                await notificationRepository.AddAsync(notification1);
                await notificationService.SendNotificationToUser(notification1.UserId, notification1);
            }
        }
    }
}
