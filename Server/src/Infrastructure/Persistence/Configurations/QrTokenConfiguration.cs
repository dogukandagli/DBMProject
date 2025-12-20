using Domain.LoanTransactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class QrTokenConfiguration : IEntityTypeConfiguration<QrToken>
{
    public void Configure(EntityTypeBuilder<QrToken> builder)
    {

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
            .ValueGeneratedNever();

        builder.HasIndex(x => x.TokenHash)
               .IsUnique();


        builder.Property(x => x.TokenHash)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(x => x.Type)
               .HasConversion<string>()
               .HasMaxLength(20)
               .IsRequired();

        builder.Property(x => x.ExpiresAt)
               .IsRequired();

        builder.Property(x => x.UsedAt).IsRequired(false);
        builder.Property(x => x.UsedByUserId).IsRequired(false);

        builder.Ignore(x => x.IsUsed);

    }
}