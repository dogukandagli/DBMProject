using Application.BorrowRequests.Queries.DTOs;
using Application.Common;
using Application.Events.Interfaces;
using Application.Events.Queries.GetEvents;
using Application.Services;
using Domain.Events.Repositories;
using Domain.Users;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TS.Result;

namespace Application.Events.Queries.GetMyEvents;

public sealed record GetMyEventsQuery(
    int Page,
    int PageSize
    ) : IRequest<Result<PagedResult<EventDto>>>;

internal sealed class GetMyEventsQueryHandler(
    IClaimContext claimContext,
    UserManager<AppUser> userManager,
    IEventRepository eventRepository,
    IEventReadService eventReadService
    ) : IRequestHandler<GetMyEventsQuery, Result<PagedResult<EventDto>>>
{
    public async Task<Result<PagedResult<EventDto>>> Handle(GetMyEventsQuery request, CancellationToken cancellationToken)
    {
        Guid userId = claimContext.GetUserId();

        AppUser? appUser = await userManager.FindByIdAsync(userId.ToString());
        if (appUser is null)
            return Result<PagedResult<EventDto>>.Failure("Kullanıcı bulunamadı.");

        EventsByUserSpecification eventsByUserSpecification = new(userId);

        int totalCount = await eventRepository.CountAsync(eventsByUserSpecification, cancellationToken);

        eventsByUserSpecification.ApplyPaging(request.Page, request.PageSize);

        List<EventDto> eventDtos = await eventReadService.GetEventsAsync(
            eventsByUserSpecification,
            userId,
            cancellationToken
        );

        PagedResult<EventDto> result = new(
            eventDtos,
            request.Page,
            request.PageSize,
            totalCount,
            (int)Math.Ceiling(totalCount / (double)request.PageSize)
        );

        return result;
    }
}