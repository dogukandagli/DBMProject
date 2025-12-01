using Application.Services;
using Domain.Abstractions;
using Domain.Users;
using GenericRepository;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public sealed class ApplicationDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>, IUnitOfWork
{
    private readonly IMediator mediator;
    private readonly IClaimContext claimContext;
    public ApplicationDbContext(DbContextOptions options, IMediator _mediator, IClaimContext _claimContext) : base(options)
    {
        mediator = _mediator;
        claimContext = _claimContext;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        Guid userId = claimContext.GetUserId();

        ApplyAuditInfo(userId);

        var result = await base.SaveChangesAsync(cancellationToken);

        await DispatchDomainEventsAsync(cancellationToken);

        return result;
    }

    private void ApplyAuditInfo(Guid userId)
    {

        var entries = ChangeTracker
            .Entries<AuditableEntity>()
            .Where(e =>
                e.State == EntityState.Added ||
                e.State == EntityState.Modified ||
                e.State == EntityState.Deleted);

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Property(p => p.CreatedAt).CurrentValue = DateTimeOffset.UtcNow;
                entry.Property(p => p.CreatedBy).CurrentValue = userId;
                entry.Property(p => p.IsActive).CurrentValue = true;
                entry.Property(p => p.IsDeleted).CurrentValue = false;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Property(p => p.CreatedAt).IsModified = false;
                entry.Property(p => p.CreatedBy).IsModified = false;

                if (entry.Property(p => p.IsDeleted).CurrentValue == true)
                {
                    entry.Property(p => p.DeletedAt).CurrentValue = DateTimeOffset.UtcNow;
                    entry.Property(p => p.DeletedBy).CurrentValue = userId;
                    entry.Property(p => p.IsActive).CurrentValue = false;
                }
                else
                {
                    entry.Property(p => p.UpdatedAt).CurrentValue = DateTimeOffset.UtcNow;
                    entry.Property(p => p.UpdatedBy).CurrentValue = userId;
                }
            }

            if (entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entry.Property(p => p.IsDeleted).CurrentValue = true;
                entry.Property(p => p.DeletedAt).CurrentValue = DateTimeOffset.UtcNow;
                entry.Property(p => p.DeletedBy).CurrentValue = userId;
                entry.Property(p => p.IsActive).CurrentValue = false;
            }
        }
    }
    private async Task DispatchDomainEventsAsync(CancellationToken cancellationToken)
    {
        // AggregateRoot'tan türeyen entity'lerdeki event'leri topla
        var domainEntities = ChangeTracker
            .Entries<AggregateRoot>()
            .Where(x => x.Entity.DomainEvents.Any())
            .ToList();

        var domainEvents = domainEntities
            .SelectMany(x => x.Entity.DomainEvents)
            .ToList();

        // Event’leri temizle (aynı event tekrar publish olmasın)
        domainEntities.ForEach(entity => entity.Entity.ClearDomainEvents());

        // Publish
        foreach (var domainEvent in domainEvents)
        {
            await mediator.Publish(domainEvent, cancellationToken);
        }
    }
}