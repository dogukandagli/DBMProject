using Domain.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Events
{
    public sealed class EventParticipant : Entity
    {
        public int UserId { get; private set; }
        public DateTime JoinDate { get; private set; }

        public EventParticipant(int userId)
        {
            SetUserId(userId);
            JoinDate = DateTime.UtcNow;
        }
        public void SetUserId(int userId)
        {
            if (userId <= 0)
                throw new ArgumentException("Geçersiz kullanıcı ID'si.");
            UserId = userId;
        }
    }
}
