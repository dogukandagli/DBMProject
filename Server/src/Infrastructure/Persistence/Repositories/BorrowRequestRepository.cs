using Ardalis.Specification.EntityFrameworkCore;
using Domain.BorrowRequests;
using Domain.BorrowRequests.Repositories;
using Infrastructure.Persistence.Context;

namespace Infrastructure.Persistence.Repositories;

internal class BorrowRequestRepository : RepositoryBase<BorrowRequest>, IBorrowRequestRepository
{
    public BorrowRequestRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
