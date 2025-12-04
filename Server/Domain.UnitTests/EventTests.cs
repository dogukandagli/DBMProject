using Xunit; 
using Domain.Events; 
using Domain.Events.Enums;
using System;
using System.Linq;

namespace Domain.UnitTests
{
    public class EventTests
    {
        private Event CreateValidEvent()
        {
            return new Event(
                neighborhoodId: 1,
                title: "Halısaha Maçı",
                description: "Akşam 9-10 arası",
                startAt: DateTime.Now.AddDays(1),
                endAt: DateTime.Now.AddDays(1).AddHours(1),
                status: StatusType.Upcoming,
                visibility: EventVisibility.Public,
                price: 100,
                capacity: 10
            );
        }

        [Fact] 
        public void AddParticipant_Should_Increase_CurrentCount_When_User_Is_Valid()
        {
            var eventEntity = CreateValidEvent();
            int userId = 5;

            eventEntity.AddParticipant(userId);

            Assert.Equal(1, eventEntity.CurrentCount); 
            Assert.Contains(eventEntity.Participants, p => p.UserId == userId); 
        }

        [Fact]
        public void AddParticipant_Should_Throw_Exception_When_Capacity_Is_Full()
        {

            var eventEntity = CreateValidEvent();
            eventEntity.SetCapacity(1);
            eventEntity.AddParticipant(10);

            var exception = Assert.Throws<InvalidOperationException>(() =>
            {
                eventEntity.AddParticipant(20);
            });

            Assert.Equal("Etkinlik kapasitesi doldu.", exception.Message);
        }

        [Fact]
        public void AddParticipant_Should_Throw_Exception_When_User_Already_Joined()
        {

            var eventEntity = CreateValidEvent();
            int userId = 50;

            eventEntity.AddParticipant(userId);

            var exception = Assert.Throws<ArgumentException>(() =>
            {
                eventEntity.AddParticipant(userId);
            });

  
            Assert.Equal("Kullanıcı zaten etkinliğe katılmış.", exception.Message);
        }

        [Fact]
        public void AddParticipant_Should_Throw_Exception_When_Event_Is_Ended()
        {

            var eventEntity = CreateValidEvent();

            eventEntity.Reschedule(
                startAt: DateTime.UtcNow.AddHours(-5),
                endAt: DateTime.UtcNow.AddHours(-1)
            );

            var exception = Assert.Throws<InvalidOperationException>(() =>
            {
                eventEntity.AddParticipant(101);
            });

            Assert.Equal("Bu etkinlik sona ermiştir, kayıt yapılamaz.", exception.Message);
        }

        [Fact]
        public void AddParticipant_Should_Throw_Exception_When_UserId_Is_Invalid()
        {

            var eventEntity = CreateValidEvent();
            int invalidUserId = 0; 

            var exception = Assert.Throws<ArgumentException>(() =>
            {
                eventEntity.AddParticipant(invalidUserId);
            });

            Assert.Equal("Geçersiz kullanıcı ID'si.", exception.Message);
        }

        [Fact]
        public void RemoveParticipant_Should_Decrease_CurrentCount()
        {

            var eventEntity = CreateValidEvent();
            int userId = 99;

            eventEntity.AddParticipant(userId);

            Assert.Equal(1, eventEntity.CurrentCount);

            eventEntity.RemoveParticipant(userId);

            Assert.Equal(0, eventEntity.CurrentCount);
            Assert.DoesNotContain(eventEntity.Participants, p => p.UserId == userId);
        }
    }
}
