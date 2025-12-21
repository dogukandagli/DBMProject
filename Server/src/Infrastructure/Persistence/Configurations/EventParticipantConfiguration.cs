using Domain.Events;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;
    public sealed class EventParticipantConfiguration : IEntityTypeConfiguration<EventParticipant>
    {
        public void Configure(EntityTypeBuilder<EventParticipant> builder)
        {
            builder.HasKey(t => new { t.EventId, t.UserId });

            builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

             builder.HasOne<Event>()
             .WithMany(p => p.Participants)
             .HasForeignKey(c => c.EventId)
             .OnDelete(DeleteBehavior.Cascade);
        }
    }
