using Domain.Posts;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id)
            .ValueGeneratedNever();

        builder.Property(c => c.Content)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasOne<Post>()
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(c => c.CreatedBy)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(c => c.PostId)
            .HasDatabaseName("IX_Comments_PostId");
    }
}