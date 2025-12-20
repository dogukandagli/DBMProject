using Domain.Conversations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.SenderId)
            .IsRequired(false);

        builder.Property(x => x.Type)
               .HasConversion<int>();

        builder.HasOne<Conversation>()
               .WithMany()
               .HasForeignKey(m => m.ConversationId)
               .OnDelete(DeleteBehavior.Cascade)
               .IsRequired();

        builder.HasIndex(x => x.ConversationId);
    }
}
