using Domain.Neighborhoods;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class CityConfiguration : IEntityTypeConfiguration<City>
{
    public void Configure(EntityTypeBuilder<City> builder)
    {

        builder.Property(c => c.Name)
               .IsRequired()
               .HasMaxLength(50);

    }
}
