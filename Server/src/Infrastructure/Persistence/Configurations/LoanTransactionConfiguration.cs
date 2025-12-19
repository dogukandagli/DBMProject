using Domain.BorrowRequests;
using Domain.LoanTransactions;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public sealed class LoanTransactionConfiguration : IEntityTypeConfiguration<LoanTransaction>
{
    public void Configure(EntityTypeBuilder<LoanTransaction> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .ValueGeneratedNever();

        builder.Property(x => x.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.OwnsOne(b => b.LoanPeriod, time =>
        {
            time.Property(t => t.Start).HasColumnName("LoanStartDate").IsRequired();
            time.Property(t => t.End).HasColumnName("LoanEndDate").IsRequired();
        });

        builder.OwnsOne(p => p.PickupLocation, loc =>
        {
            loc.Property(l => l.Latitude)
            .HasColumnName("PickupLatitude")
            .HasPrecision(18, 10);

            loc.Property(l => l.Longitude)
            .HasColumnName("PickupLongitude")
            .HasPrecision(18, 10);
        });

        builder.OwnsOne(x => x.ReturnLocation, loc =>
        {
            loc.Property(l => l.Latitude)
                .HasColumnName("ReturnLatitude")
                .HasPrecision(18, 10);

            loc.Property(l => l.Longitude)
                .HasColumnName("ReturnLongitude")
                .HasPrecision(18, 10);
        });

        builder.HasOne<AppUser>()
        .WithMany()
        .HasForeignKey(x => x.BorrowerId)
        .IsRequired()
        .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<AppUser>()
        .WithMany()
        .HasForeignKey(x => x.LenderId)
        .IsRequired()
        .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<BorrowRequest>()
        .WithOne()
        .HasForeignKey<LoanTransaction>(x => x.BorrowRequestId)
        .IsRequired()
        .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.BorrowerId)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder.HasIndex(x => x.LenderId);
        builder.HasIndex(x => x.Status);
    }
}
