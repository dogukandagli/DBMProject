using Domain.Neighborhoods;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public sealed class NeighborhoodEdgeConfiguration : IEntityTypeConfiguration<NeighborhoodEdge>
    {
        public void Configure(EntityTypeBuilder<NeighborhoodEdge> builder)
        {
            builder.ToTable("NeighborhoodEdge");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.DistanceKm)
                   .HasColumnType("float");

            builder.Property(e => e.IsBidirectional)
                   .HasColumnType("bit")
                   .HasDefaultValue(true);
            builder.HasOne<Neighborhood>()
                   .WithMany()
                   .HasForeignKey(e => e.FromNeighborhoodId)
                   .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<Neighborhood>()
                   .WithMany()
                   .HasForeignKey(e => e.ToNeighborhoodId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(e => e.FromNeighborhoodId);
            builder.HasIndex(e => e.ToNeighborhoodId);
        }
    }
}
