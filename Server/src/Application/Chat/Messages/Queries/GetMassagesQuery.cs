using Application.Chat.Messages.Interfaces;
using Application.Common;
using Application.Services;
using Domain.Conversations;
using Domain.Conversations.Repositorues;
using Domain.Conversations.Specifications;
using MediatR;
using TS.Result;

namespace Application.Chat.Messages.Queries;

public sealed record GetMassagesQuery(
    Guid ConversationId,
    DateTimeOffset? Cursor,
    int PageSize = 20) : IRequest<Result<CursorPaginatedResponse<MessageDto>>>;

public sealed class GetMassagesQueryHandler(
    IConversationRepository conversationRepository,
    IClaimContext claimContext,
    IMessageReadService messageReadService) : IRequestHandler<GetMassagesQuery, Result<CursorPaginatedResponse<MessageDto>>>
{
    public async Task<Result<CursorPaginatedResponse<MessageDto>>> Handle(GetMassagesQuery request, CancellationToken cancellationToken)
    {
        Guid currentUserId = claimContext.GetUserId();

        ConversationWithParticipantById conversationWithParticipantById = new(request.ConversationId);
        Conversation? conversation = await conversationRepository.FirstOrDefaultAsync(conversationWithParticipantById, cancellationToken);
        if (conversation is null)
            return Result<CursorPaginatedResponse<MessageDto>>.Failure("Sohbet bulunumadi");

        Participant? myParticipant = conversation.Participants.FirstOrDefault(p => p.UserId == currentUserId);
        if (myParticipant is null)
            return Result<CursorPaginatedResponse<MessageDto>>.Failure("Yetkisiz işlem");

        Participant? otherParticipant = conversation.Participants.FirstOrDefault(p => p.UserId != currentUserId);
        DateTimeOffset? otherUserLastReadAt = otherParticipant?.LastReadAt;

        return await messageReadService.GetMessagesAsync(
            currentUserId,
            request.ConversationId,
            otherUserLastReadAt,
            request.Cursor,
            request.PageSize,
            cancellationToken);
    }
}