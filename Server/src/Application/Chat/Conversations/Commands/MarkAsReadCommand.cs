using Application.Services;
using Domain.Conversations.Repositorues;
using Domain.Conversations.Specifications;
using MediatR;
using TS.Result;

namespace Application.Chat.Conversations.Commands;

public sealed record MarkAsReadCommand(
    Guid ConversationId) : IRequest<Result<Unit>>;

internal sealed class MarkAsReadCommandHandler(
    IConversationRepository conversationRepository,
    IClaimContext claimContext)
    : IRequestHandler<MarkAsReadCommand, Result<Unit>>
{
    public async Task<Result<Unit>> Handle(MarkAsReadCommand request, CancellationToken cancellationToken)
    {
        var currentUserId = claimContext.GetUserId();
        var now = DateTimeOffset.UtcNow;

        ConversationWithParticipantById conversationWithParticipantById = new(request.ConversationId);
        var conversation = await conversationRepository.FirstOrDefaultAsync(conversationWithParticipantById, cancellationToken);

        if (conversation is null)
            return Result<Unit>.Failure("Sohbet yok");

        conversation.MarkAsRead(currentUserId, now);

        await conversationRepository.SaveChangesAsync();
        return Unit.Value;
    }
}