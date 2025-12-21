using Application.Events.Interfaces;
using Application.Events.Queries.GetEventParticipants;
using Application.Events.Queries.GetEvents;
using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Domain.Events;
using Domain.Users;
using Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Persistence.QueryServices;

public sealed class EventsReadServices(
    ApplicationDbContext context,
    UserManager<AppUser> userManager) : IEventReadService
{
    public async Task<List<EventDto>> GetEventsAsync(ISpecification<Event> specification, Guid currentUserId, CancellationToken cancellationToken = default)
    {
        var eventQuery = SpecificationEvaluator.Default
            .GetQuery(context.Event.AsQueryable(), specification);

        var query = from @event in eventQuery
                    join user in userManager.Users on @event.CreatedBy equals user.Id

                    let isOwner = @event.CreatedBy == currentUserId
                    let isJoined = @event.Participants.Any(p => p.UserId == currentUserId)
                    let participantCount = @event.Participants.Count()
                    let isFull = @event.Capacity != null && participantCount >= @event.Capacity
                    let isFinished = @event.EndAt < DateTimeOffset.UtcNow
                    let isCancelled = @event.Status == StatusType.Cancelled

                    select new EventDto(
                        @event.Id,
                        @event.Title,
                        @event.CoverPhotoUrl,
                        "Adres Bilgisi Yakında eklenecek",
                        @event.StartAt,
                        @event.EndAt,
                        @event.CreatedAt,
                        @event.Capacity,
                        participantCount,
                        @event.Price,
                        @event.Description,
                        new UserDto(
                            user.Id,
                            user.FullName,
                            user.ProfilePhotoUrl,
                            isOwner
                        ),
                        new EventActions(
                            !isOwner && !isJoined && !isFull && !isCancelled && !isFinished,
                            !isOwner && isJoined && !isFinished && !isCancelled
                        ),
                        new EventOwnerActions(
                            isOwner && (isFinished || isCancelled),
                            isOwner && !(isFinished || isCancelled),
                            isOwner && @event.StartAt > DateTimeOffset.UtcNow && !isCancelled
                        )
                    );

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<List<ParticipantDto>> GetEventParticipantsAsync(ISpecification<EventParticipant> specification, Guid eventId, CancellationToken cancellationToken = default)
    {

        var eventQuery = SpecificationEvaluator.Default
            .GetQuery(context.EventParticipant.AsQueryable(), specification);

        var query = from participant in eventQuery
                    join user in userManager.Users on participant.UserId equals user.Id

                    select new ParticipantDto(
                        user.Id,
                        user.FullName,
                        user.ProfilePhotoUrl,
                        participant.CreatedAt
                    );


        return await query.ToListAsync(cancellationToken);
    }

    public async Task<int> GetParticipantCountAsync(
        Guid eventId,
        CancellationToken cancellationToken = default)
    {

        return await context.EventParticipant
            .CountAsync(x => x.EventId == eventId, cancellationToken);
    }


}
