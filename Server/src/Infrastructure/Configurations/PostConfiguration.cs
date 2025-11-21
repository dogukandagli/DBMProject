using Domain.Neighborhoods;
using Domain.Posts;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(p => p.CreatedBy)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Medias)
            .WithOne()
            .HasForeignKey(i => i.PostId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Neighborhood>()
            .WithMany()
            .HasForeignKey(p => p.NeighborhoodId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);


        builder.Property(p => p.Content).IsRequired().HasMaxLength(500);

        builder.Property(p => p.PostType).HasConversion<string>();
        builder.Property(p => p.PostVisibilty).HasConversion<string>();

        builder.OwnsOne(p => p.Location, loc =>
        {
            loc.Property(l => l.Latitude).HasColumnName("Latitude").IsRequired(false);
            loc.Property(l => l.Longitude).HasColumnName("Longitude").IsRequired(false);
        });

        builder.Property(p => p.ReadableAddress).IsRequired(false);
    }
}
