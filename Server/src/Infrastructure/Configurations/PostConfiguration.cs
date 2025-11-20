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

        builder.HasMany(p => p.Images)
            .WithOne()
            .HasForeignKey(i => i.PostId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
        builder.Property(p => p.Content).IsRequired().HasMaxLength(500);

        builder.Property(p => p.PostType).HasConversion<string>();
        builder.OwnsOne(p => p.Location, a =>
        {
            a.Property(l => l.Latitude)
             .HasColumnName("Latitude")
             .IsRequired()
             ;

            a.Property(l => l.Longitude)
            .HasColumnName("Longitude")
             .IsRequired()

            ;
        })
            ;

    }
}
