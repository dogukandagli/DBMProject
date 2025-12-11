using Domain.Events;
using Domain.Posts;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Configurations;
    public sealed class EventParticipantConfiguration : IEntityTypeConfiguration<EventParticipant>
    {
        public void Configure(EntityTypeBuilder<EventParticipant> builder)
        {
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
