using Domain.Neighborhoods;
using Domain.Posts;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Content)
           .IsRequired()
           .HasMaxLength(500);

        builder.Property(p => p.PostType)
            .HasConversion<string>();

        builder.Property(p => p.PostVisibilty)
            .HasConversion<string>();

        builder.Property(p => p.IsCommentingEnabled)
           .IsRequired()
           .HasDefaultValue(true);

        builder.Property(p => p.ReadableAddress)
            .IsRequired(false);

        builder.OwnsOne(p => p.Location, loc =>
        {
            loc.Property(l => l.Latitude).HasColumnName("Latitude").IsRequired(false);
            loc.Property(l => l.Longitude).HasColumnName("Longitude").IsRequired(false);
        });

        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(p => p.CreatedBy)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Neighborhood>()
            .WithMany()
            .HasForeignKey(p => p.NeighborhoodId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Medias)
            .WithOne()
            .HasForeignKey(i => i.PostId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(p => p.Medias)
        .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasMany(p => p.Comments)
                .WithOne()
                .HasForeignKey(i => i.PostId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(p => p.Comments)
        .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasMany(p => p.Reactions)
            .WithOne()
            .HasForeignKey(r => r.PostId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(p => p.Reactions)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(p => new { p.PostVisibilty, p.CreatedAt })
            .HasDatabaseName("IX_Post_Visibility_CreatedAt");

        builder.HasIndex(p => new { p.CreatedBy, p.CreatedAt })
            .HasDatabaseName("IX_Post_AuthorId_CreatedAt");
    }
}
