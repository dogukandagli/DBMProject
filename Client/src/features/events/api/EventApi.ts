import { queries } from "../../../shared/api/ApiClient";

export const Event = {
    createEvent: (formData: any) => queries.post("events", formData),
    deleteEvent: (id: string) => queries.delete(`events?EventId=${id}`),
    cancelEvent: (id: string) => queries.post(`events/cancel?EventId=${id}`, {}),
    joinEvent: (id: string) => queries.post(`events/join?EventId=${id}`, {}),  
    leaveEvent: (id: string) => queries.post(`events/leave?EventId=${id}`, {}),
    getEvents: (pageParam: any) => queries.get(`events/${pageParam}/6`),
    getMyEvents: (pageParam: any) => queries.get(`events/me/${pageParam}/6`),
    getMyGoingEvents: (pageParam: any) => queries.get(`events/me/going/${pageParam}/6`),
    getEventParticipants: (id: string ,pageParam: any) => queries.get(`events/participants/${pageParam}/6?EventId=${id}`)
}