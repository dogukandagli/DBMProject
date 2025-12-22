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


        if (notification.SenderId is null)
            return;

        AppUser? user = await userManager.FindByIdAsync(notification.SenderId.ToString()!);
        if (user is null)
        {
            logger.LogError($"{notification.SenderId} id li Kullanıcı bulunamadı.");
            return;
        }

        string title = "Mesajınız var.";
        string message = $"{user.FullName} kişisinden mesajınız var.";

        foreach (Participant participant in conversation.Participants)
        {
            if (user.Id != participant.UserId)
            {
                Notification notification1 = new Notification(
                   participant.UserId,
                   title,
                   message,
                   NotificationType.General,
                   notification.ConversationId);

                await notificationRepository.AddAsync(notification1);
                await notificationService.SendNotificationToUser(notification1.UserId, notification1);
            }
        }
    }
}
