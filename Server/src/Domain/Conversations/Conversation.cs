using Domain.Abstractions;
using Domain.Conversations.Enums;

namespace Domain.Conversations;

public sealed class Conversation : AggregateRoot
{
    private readonly List<Participant> participants = new();

    public ConversationType Type { get; private set; }
    public Guid? RelatedEntityId { get; private set; }
    public string? LastMessagePreview { get; private set; }
    public DateTimeOffset? LastMessageAt { get; private set; }
    public Guid? LastMessageSenderId { get; private set; }

    public IReadOnlyCollection<Participant> Participants => participants.AsReadOnly();

    private Conversation() { }

    public static Conversation CreateDirect(Guid userA, Guid userB)
    {
        if (userA == userB)
            throw new DomainException("Kendinle sohbet oluşturamazsın.");

        Conversation conversation = new Conversation
        {
            Type = ConversationType.Direct
        };

        conversation.AddParticipant(userA);
        conversation.AddParticipant(userB);

        return conversation;
    }
    public static Conversation CreateForLoan(Guid loanId, Guid borrowerId, Guid lenderId)
    {
        Conversation conversation = new Conversation
        {
            Type = ConversationType.LoanTransaction,
            RelatedEntityId = loanId,
        };
        conversation.AddParticipant(borrowerId);
        conversation.AddParticipant(lenderId);
        return conversation;
    }

    public void AddParticipant(Guid userId)
    {
        if (participants.Any(p => p.UserId == userId))
        {
            return;
        }
        if (Type == ConversationType.Direct && participants.Count >= 2)
        {
            throw new DomainException("Birebir sohbetlere 2 kişiden fazlası eklenemez.");
        }

        Participant participant = Participant.Create(this.Id, userId);
        participants.Add(participant);
    }

    public void UpdateLastMessage(string content, DateTimeOffset at, Guid? senderId)
    {
        const int MaxPreviewLength = 60;

        LastMessagePreview = content.Length > MaxPreviewLength
            ? content.Substring(0, MaxPreviewLength) + "..."
            : content;

        LastMessageAt = at;
        LastMessageSenderId = senderId;
    }

    public bool HasParticipant(Guid userId)
    {
        return participants.Any(p => p.UserId == userId);
    }
}
