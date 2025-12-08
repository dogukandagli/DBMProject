using Domain.Posts;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class ReactionConfiguration : IEntityTypeConfiguration<Reaction>
{
    public void Configure(EntityTypeBuilder<Reaction> builder)
    {
        builder.Property(r => r.Id)
            .ValueGeneratedNever();

        builder.Property(r => r.Type)
               .HasConversion<string>()
               .IsRequired()
               .HasMaxLength(20);

        builder.Property(r => r.CreatedBy)
               .IsRequired();

        builder.Property(r => r.CreatedAt)
               .IsRequired();

        builder.HasOne<Post>()
               .WithMany(p => p.Reactions)
               .HasForeignKey(r => r.PostId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<AppUser>()
           .WithMany()
           .HasForeignKey(c => c.CreatedBy)
           .IsRequired()
           .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(r => r.PostId);

        builder.HasIndex(r => new { r.PostId, r.CreatedBy })
               .IsUnique()
               .HasFilter("[IsDeleted]=0");
    }
}

