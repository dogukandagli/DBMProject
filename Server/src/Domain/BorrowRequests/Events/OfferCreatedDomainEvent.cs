using Domain.Abstractions;
using Domain.Shared.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.BorrowRequests.Events;

public sealed class OfferCreatedDomainEvent : DomainEvent
{
    public Guid BorrowRequestId { get; }
    public UserId BorrowerId { get; }
    public UserId LenderId { get; }

    public OfferCreatedDomainEvent(
        Guid borrowRequestId,
        UserId borrowerId,
        UserId lenderId)
    {
        BorrowRequestId = borrowRequestId;
        BorrowerId = borrowerId;
        LenderId = ;
    }
}
