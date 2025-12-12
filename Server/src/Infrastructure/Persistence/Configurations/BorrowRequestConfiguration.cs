using Domain.BorrowRequests;
using Domain.Neighborhoods;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class BorrowRequestConfiguration : IEntityTypeConfiguration<BorrowRequest>
{
    public void Configure(EntityTypeBuilder<BorrowRequest> builder)
    {
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id)
            .ValueGeneratedNever();


        builder.OwnsOne(b => b.ItemNeeded, item =>
        {
            item.Property(i => i.Title).HasColumnName("ItemTitle").HasMaxLength(200).IsRequired();
            item.Property(i => i.Description).HasColumnName("ItemDescription").HasMaxLength(1000);
            item.Property(i => i.Category).HasColumnName("ItemCategory").HasMaxLength(100).IsRequired();
            item.Property(i => i.ImageUrl).HasColumnName("ItemImageUrl");
        });

        builder.OwnsOne(b => b.NeededDates, time =>
        {
            time.Property(t => t.Start).HasColumnName("NeededStartTime").IsRequired();
            time.Property(t => t.End).HasColumnName("NeededEndTime").IsRequired();
        });

        builder.Property(b => b.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasMany(b => b.Offers)
            .WithOne()
            .HasForeignKey("BorrowRequestId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Neighborhood>()
            .WithMany()
            .HasForeignKey(p => p.NeighborhoodId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(b => b.BorrowerId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.Navigation(b => b.Offers).Metadata.SetField("offers");
        builder.Navigation(b => b.Offers).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
