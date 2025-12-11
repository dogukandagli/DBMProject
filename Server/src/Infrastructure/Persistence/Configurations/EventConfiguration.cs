using Domain.Events;
using Domain.Neighborhoods;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.Property(e => e.Id)
            .ValueGeneratedNever();

        builder.HasOne<Neighborhood>()
            .WithMany()
            .HasForeignKey(e => e.NeighborhoodId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(p => p.CreatedBy)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.Title).IsRequired().HasMaxLength(200);
        builder.Property(e => e.Description).HasMaxLength(1500);


        builder.Property(e => e.Status).HasConversion<string>();
        builder.Property(e => e.Visibility).HasConversion<string>();

        builder.Property(p => p.CurrentCount)
               .IsRequired()
               .HasDefaultValue(0);

        builder.Property(p => p.Capacity)
               .IsRequired(false);

        builder.Property(p => p.Price)
               .HasColumnType("decimal(18,2)")
               .IsRequired(false);

        builder.OwnsOne(e => e.Location, loc =>
        {
            loc.Property(l => l.Latitude).HasColumnName("Latitude").IsRequired(false);
            loc.Property(l => l.Longitude).HasColumnName("Longitude").IsRequired(false);
        });
    }
}

