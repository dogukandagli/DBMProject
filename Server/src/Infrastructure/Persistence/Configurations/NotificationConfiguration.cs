using Domain.Notifications;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public sealed class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(n => n.Id);
        builder.Property(n => n.Id)
            .ValueGeneratedNever();

        builder.Property(n => n.Title)
                .IsRequired()
                .HasMaxLength(150);

        builder.Property(n => n.Message)
                .IsRequired()
                .HasMaxLength(500);

        builder.Property(n => n.Type)
                .HasConversion<string>()
                .HasMaxLength(50);

        builder.Property(n => n.IsRead)
                .HasDefaultValue(false);

        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(n => n.UserId);

        builder.HasIndex(n => new { n.UserId, n.IsRead, n.CreatedAt });
    }
}
