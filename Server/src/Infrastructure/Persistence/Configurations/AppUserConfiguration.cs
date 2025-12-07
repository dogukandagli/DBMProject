using Domain.Neighborhoods;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal sealed class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.OwnsOne(x => x.FirstName, a =>
        {
            a.Property(p => p.Value).HasColumnName("FirstName").HasMaxLength(50).IsRequired();
        });

        builder.OwnsOne(x => x.LastName, a =>
        {
            a.Property(p => p.Value).HasColumnName("LastName").HasMaxLength(50).IsRequired();
        });
        builder.Property(u => u.BirthDate)
            .HasColumnType("date")
            .IsRequired();

        builder.OwnsOne(p => p.Location, a =>
        {
            a.Property(l => l.Latitude)
             .HasColumnName("Latitude")
             ;

            a.Property(l => l.Longitude)
            .HasColumnName("Longitude")
            ;
        });

        builder.Ignore(u => u.FullName);

        builder.HasOne<Neighborhood>()
            .WithMany()
            .HasForeignKey(u => u.NeighborhoodId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
