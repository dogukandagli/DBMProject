using Domain.BorrowRequests;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class OfferConfiguration : IEntityTypeConfiguration<Offer>
{
    public void Configure(EntityTypeBuilder<Offer> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Id)
            .ValueGeneratedNever();


        builder.OwnsOne(o => o.OfferedItem, item =>
        {
            item.Property(i => i.Description).HasColumnName("Description").HasMaxLength(500).IsRequired();

            item.Property(i => i.Condition)
                .HasColumnName("ItemCondition")
                .HasConversion<string>()
                .HasMaxLength(20);
        });

        builder.Property(o => o.HandoverMethod)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.OwnsOne(o => o.AvailableTimeSlot, time =>
        {
            time.Property(t => t.Start).HasColumnName("AvailableStartTime");
            time.Property(t => t.End).HasColumnName("AvailableEndTime");
        });

        builder.OwnsMany(o => o.PhotoUrls, p =>
        {
            p.ToTable("OfferPhotos");
            p.WithOwner().HasForeignKey("OfferId");

            p.Property(p => p.Url)
                .HasColumnName("Url")
                .HasMaxLength(500)
                .IsRequired();

            p.Property(p => p.IsMain)
            .HasColumnName("IsMain")
            .HasDefaultValue(false);

            p.HasKey("Id");
        });

        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(b => b.LenderId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.Navigation(x => x.PhotoUrls).Metadata.SetField("photoUrls");
        builder.Navigation(x => x.PhotoUrls).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
