using Domain.Events;
using Domain.Neighborhoods;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {

        builder.HasOne<Neighborhood>()
            .WithMany()
            .HasForeignKey(e => e.NeighborhoodId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict); 

        builder.HasMany(e => e.EventMedias)
            .WithOne()
            .HasForeignKey("EventId") 
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Participants)
            .WithOne()
            .HasForeignKey("EventId") 
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);


        builder.HasMany(e => e.Categories)
            .WithOne()
            .HasForeignKey("EventId")
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(e => e.Title).IsRequired().HasMaxLength(200);
        builder.Property(e => e.Description).IsRequired().HasMaxLength(2000);


        builder.Property(e => e.Status).HasConversion<string>();
        builder.Property(e => e.Visibility).HasConversion<string>();

        builder.OwnsOne(e => e.Location, loc =>
        {
            loc.Property(l => l.Latitude).HasColumnName("Latitude").IsRequired(false);
            loc.Property(l => l.Longitude).HasColumnName("Longitude").IsRequired(false);
        });
    }
}

