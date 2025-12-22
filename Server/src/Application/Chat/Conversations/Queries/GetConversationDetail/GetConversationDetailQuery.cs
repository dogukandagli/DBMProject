using Application.Services;
using Domain.Conversations;
using Domain.Conversations.Enums;
using Domain.Conversations.Repositorues;
using Domain.Conversations.Specifications;
using Domain.LoanTransactions;
using Domain.LoanTransactions.Repositories;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Chat.Conversations.Queries.GetConversationDetail;

public sealed record GetConversationDetailQuery(
    Guid ConversationId) : IRequest<Result<ConversationDetailDto>>;

internal sealed class GetConversationDetailQueryHandler(
    IConversationRepository conversationRepository,
    IClaimContext claimContext,
    UserManager<AppUser> userManager,
    ILoanTransactionRepository loanTransactionRepository) : IRequestHandler<GetConversationDetailQuery, Result<ConversationDetailDto>>
{
    public async Task<Result<ConversationDetailDto>> Handle(GetConversationDetailQuery request, CancellationToken cancellationToken)
    {
        ConversationWithParticipantById conversationWithParticipantById = new(request.ConversationId);
        Conversation? conversation = await conversationRepository.FirstOrDefaultAsync(conversationWithParticipantById, cancellationToken);
        if (conversation is null)
            return Result<ConversationDetailDto>.Failure("Sohbet bulunumadı.");

        Guid currentUserId = claimContext.GetUserId();
        if (!conversation.Participants.Any(p => p.UserId == currentUserId))
            return Result<ConversationDetailDto>.Failure("Bu sohbeti görüntüleyemezsiniz.");

        ConversationDetailDto conversationDetailDto = new()
        {
            Id = conversation.Id,
            ConversationType = conversation.Type.ToString(),
        };

        switch (conversation.Type)
        {
            case ConversationType.Direct:
                {
                    Participant? otherParticipant = conversation.Participants.FirstOrDefault(p => p.UserId != currentUserId);
                    if (otherParticipant is null)
                        return Result<ConversationDetailDto>.Failure("Karşı taraf yok.");

                    AppUser? otherUser = await userManager.FindByIdAsync(otherParticipant.UserId.ToString());
                    if (otherUser is null)
                        return Result<ConversationDetailDto>.Failure("Karşı kullanici yok.");

                    conversationDetailDto.Title = otherUser.FullName;
                    conversationDetailDto.AvatarUrl = otherUser.ProfilePhotoUrl;
                    conversationDetailDto.Subtitle = "Çevrimiçi";
                    conversationDetailDto.OtherUserId = otherUser.Id;
                    break;
                }
            case ConversationType.LoanTransaction:
                {
                    Participant? otherParticipant = conversation.Participants.FirstOrDefault(p => p.UserId != currentUserId);
                    if (otherParticipant is null)
                        return Result<ConversationDetailDto>.Failure("Karşı taraf yok.");
                    AppUser? otherUser = await userManager.FindByIdAsync(otherParticipant.UserId.ToString());
                    if (otherUser is null)
                        return Result<ConversationDetailDto>.Failure("Karşı kullanici yok.");

                    conversationDetailDto.Title = otherUser.FullName;
                    conversationDetailDto.AvatarUrl = otherUser.ProfilePhotoUrl;
                    conversationDetailDto.OtherUserId = otherUser.Id;

                    if (conversation.RelatedEntityId.HasValue)
                    {
                        LoanTransaction? loanTransaction = await loanTransactionRepository.GetByIdAsync(conversation.RelatedEntityId.Value, cancellationToken);
                        if (loanTransaction is null)
                            return Result<ConversationDetailDto>.Failure("İşlem yok.");

                        conversationDetailDto.Subtitle = "Ödünç işlemi sohbeti";

                        LoanContextDto loanContextDto = new(
                            loanTransaction.Id,
                            loanTransaction.Status.ToString(),
                            loanTransaction.LoanPeriod.Start,
                            loanTransaction.LoanPeriod.End);

                        conversationDetailDto.LoanContextDto = loanContextDto;
                    }
                    break;
                }
        }

        return conversationDetailDto;
    }
}