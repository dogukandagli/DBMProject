using Domain.Neighborhoods;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class NeighborhoodConfiguration : IEntityTypeConfiguration<Neighborhood>
{
    public void Configure(EntityTypeBuilder<Neighborhood> builder)
    {
        builder.Property(n => n.Name)
               .IsRequired()
               .HasMaxLength(100);

        builder.HasOne<District>()
            .WithMany()
            .HasForeignKey(n => n.DistrictId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
