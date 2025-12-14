using Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Events
{
    public sealed class EventParticipant : AuditableEntity
    {
        public Guid UserId { get; private set; }
        public Guid EventId { get; private set; }
        public static EventParticipant CreateEventParticipant(Guid userId, Guid eventId)
        {
            return new EventParticipant()
            {
                UserId = userId,
                EventId = eventId
            };
        }
    }
}
