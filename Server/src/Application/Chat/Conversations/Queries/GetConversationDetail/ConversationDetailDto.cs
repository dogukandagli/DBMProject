namespace Application.Chat.Conversations.Queries.GetConversationDetail;

public sealed record ConversationDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Subtitle { get; set; }
    public string? AvatarUrl { get; set; }
    public string ConversationType { get; set; } = default!;
    public LoanContextDto? LoanContextDto { get; set; }
    public Guid? OtherUserId { get; set; }
}

public sealed record LoanContextDto(
    Guid LoanTransactionId,
    string TransactionStatus,
    DateTimeOffset LoanPeriodStart,
    DateTimeOffset LoanPeriodEnd
    );