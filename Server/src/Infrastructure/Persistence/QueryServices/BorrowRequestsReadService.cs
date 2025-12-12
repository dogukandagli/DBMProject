using Application.BorrowRequests.Interfaces;
using Application.BorrowRequests.Queries.GetBorrowRequests;
using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Domain.BorrowRequests;
using Domain.Users;
using Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.QueryServices;

public sealed class BorrowRequestsReadService(
    ApplicationDbContext context,
    UserManager<AppUser> userManager) : IBorrowRequestsReadService
{
    public async Task<List<BorrowRequestDto>> GetBorrowRequestsAsync(ISpecification<BorrowRequest> specification, Guid currentUserId, CancellationToken cancellationToken = default)
    {
        var borrowRequestQuery = SpecificationEvaluator.Default
            .GetQuery(context.BorrowRequest.AsQueryable(), specification);

        var query = from borrowRequest in borrowRequestQuery
                    join user in userManager.Users on borrowRequest.BorrowerId equals user.Id
                    select new BorrowRequestDto(
                        borrowRequest.Id,
                        new UserSummaryDto(
                            user.Id,
                            user.FullName,
                            user.ProfilePhotoUrl
                            ),
                        new ItemSpecificationDto(
                            borrowRequest.ItemNeeded.Title,
                            borrowRequest.ItemNeeded.Description,
                            borrowRequest.ItemNeeded.Category,
                            borrowRequest.ItemNeeded.Category),
                        new TimeSlotDto(
                            borrowRequest.NeededDates.Start,
                            borrowRequest.NeededDates.End),
                        borrowRequest.Status,
                        borrowRequest.CreatedAt,
                        borrowRequest.Offers.Count(),
                        null,
                        new BorrowRequestActionsDto(
                            borrowRequest.BorrowerId == currentUserId,
                            borrowRequest.BorrowerId == currentUserId,
                            borrowRequest.BorrowerId != currentUserId,
                            borrowRequest.BorrowerId == currentUserId,
                            borrowRequest.BorrowerId == currentUserId,
                            borrowRequest.BorrowerId != currentUserId,
                            borrowRequest.BorrowerId != currentUserId
                            ));

        return await query.ToListAsync(cancellationToken);
    }
}
