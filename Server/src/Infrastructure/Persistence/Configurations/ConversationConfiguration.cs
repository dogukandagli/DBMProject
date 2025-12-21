using Domain.Conversations;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    public void Configure(EntityTypeBuilder<Conversation> builder)
    {

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Type)
               .HasConversion<string>()
               .HasMaxLength(50)
               .IsRequired();

        builder.Property(c => c.RelatedEntityId)
               .IsRequired(false);

        builder.HasIndex(c => c.RelatedEntityId)
       .IsUnique()
       .HasFilter("[RelatedEntityId] IS NOT NULL");

        builder.HasIndex(c => c.LastMessageAt);

        builder.Property(c => c.LastMessagePreview)
               .HasMaxLength(100)
               .IsRequired(false);

        builder.Property(c => c.LastMessageAt)
               .IsRequired(false);

        builder.HasMany(c => c.Participants)
               .WithOne()
               .HasForeignKey(p => p.ConversationId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<AppUser>()
           .WithMany()
           .HasForeignKey(c => c.LastMessageSenderId)
           .OnDelete(DeleteBehavior.SetNull);

        builder.Metadata.FindNavigation(nameof(Conversation.Participants))!
               .SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}