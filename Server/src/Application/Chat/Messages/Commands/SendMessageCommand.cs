using Application.Services;
using Domain.Conversations;
using Domain.Conversations.Repositories;
using Domain.Conversations.Repositorues;
using Domain.Conversations.Specifications;
using MediatR;
using TS.Result;

namespace Application.Chat.Messages.Commands;

public sealed record SendMessageCommand(
    Guid ConversationId,
    string Content) : IRequest<Result<Unit>>;

internal sealed class SendMessageCommandHandler(
    IClaimContext claimContext,
    IConversationRepository conversationRepository,
    IMessageRepository messageRepository) : IRequestHandler<SendMessageCommand, Result<Unit>>
{
    public async Task<Result<Unit>> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();
        DateTimeOffset now = DateTimeOffset.UtcNow;

        ConversationWithParticipantById conversationWithParticipantById = new(request.ConversationId);
        Conversation? conversation = await conversationRepository.FirstOrDefaultAsync(conversationWithParticipantById, cancellationToken);
        if (conversation is null)
            return Result<Unit>.Failure("Sohbet bulunamadı.");

        Participant? myParticipant = conversation.Participants.FirstOrDefault(p => p.UserId == currentUserId);
        if (myParticipant is null)
            return Result<Unit>.Failure("Bu sohbete mesaj atamazsınız.");

        Message message = Message.CreateUserMessage(
            request.ConversationId,
            currentUserId,
            request.Content);

        await messageRepository.AddAsync(message);

        conversation.UpdateLastMessage(
            message.Content,
            message.CreatedAt,
            message.SenderId);

        // burda ilerde participant tablosuna okunmamis mesaj sayisini eklerssen butun participantlari gezip o count 1 arttir.
        myParticipant.SetLastReadAt(now);

        await conversationRepository.UpdateAsync(conversation);
        return Unit.Value;
    }
}