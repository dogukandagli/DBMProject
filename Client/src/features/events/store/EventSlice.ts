import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Event } from "../api/EventApi";
import type { EventCreateDto } from "../../../entities/event/UserEvent";
import type { RootState } from "../../../app/store/store";


interface EventState 
{
  status: string;
  nextPage: number | null;
  hasMore: boolean;
}

export const eventAdapter = createEntityAdapter<EventCreateDto,string>({
    selectId: (event) => event.eventId,
})

interface GetEventsResponse {
  items: EventCreateDto[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

const initialState = eventAdapter.getInitialState<EventState>({
    status: "idle",
    nextPage: 1,
    hasMore: true,
})


export const createEvent = createAsyncThunk<void, FormData>(
    "event/createEvent",
    async(formData) => {
        const response = await Event.createEvent(formData)
        return response.data
    }
)

export const deleteEvent = createAsyncThunk<void, string>(
    "event/deleteEvent",
    async(eventId) => {
        const response = await Event.deleteEvent(eventId)
        return response.data
    }
)

export const joinEvent = createAsyncThunk<void, string>(
    "event/joinEvent",
    async(eventId) => {
        const response = await Event.joinEvent(eventId)
        return response.data
    }
)

export const leaveEvent = createAsyncThunk<void, string>(
    "event/leaveEvent",
    async(eventId) => {
        const response = await Event.leaveEvent(eventId)
        return response.data
    }
)

export const cancelEvent = createAsyncThunk<void, string>(
    "event/cancelEvent",
    async(eventId) => {
        const response = await Event.cancelEvent(eventId)
        return response.data
    }
)

export const getEvents = createAsyncThunk<GetEventsResponse, void,{ state: RootState }>(
    "event/getEvents",
    async (_, {getState}) => {        
        const state = getState();
        const page = state.eventRequests.nextPage ?? 1;

        const response = await Event.getEvents(page);
        return response.data;
    }
)

export const getMyEvents = createAsyncThunk<GetEventsResponse, void,{ state: RootState }>(
    "event/getMyEvents",
    async (_, {getState}) => {        
        const state = getState();
        const page = state.eventRequests.nextPage ?? 1;

        const response = await Event.getMyEvents(page);
        return response.data;
    }
)

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers:{    clearEvents: (state) => {
          eventAdapter.removeAll(state);
          state.nextPage = 1;
          state.hasMore = true;
          state.status = "idle";
        },},
    extraReducers: (builder) => (
        builder.addCase(createEvent.pending,(state) => {
            state.status = "pendingCreateEvent"
        }).addCase(createEvent.fulfilled,(state) => {
            state.status = "idle"
        }).addCase(createEvent.rejected,(state) => {
            state.status = "idle"

        }).addCase(deleteEvent.pending, (state) =>{
            state.status = "pendingDeleteEvent"
        }).addCase(deleteEvent.fulfilled, (state) =>{
            state.status = "idle"
        }).addCase(deleteEvent.rejected, (state) =>{
            state.status = "idle"

        }).addCase(cancelEvent.pending, (state) =>{
            state.status = "pendingCancelEvent"
        }).addCase(cancelEvent.fulfilled, (state) =>{
            state.status = "idle"
        }).addCase(cancelEvent.rejected, (state) =>{
            state.status = "idle"

        }).addCase(joinEvent.pending, (state) =>{
            state.status = "pendingJoinEvent"
        }).addCase(joinEvent.fulfilled, (state) =>{
            state.status = "idle"
        }).addCase(joinEvent.rejected, (state) =>{
            state.status = "idle"

        }).addCase(leaveEvent.pending, (state) =>{
            state.status = "pendingLeaveEvent"
        }).addCase(leaveEvent.fulfilled, (state) =>{
            state.status = "idle"
        }).addCase(leaveEvent.rejected, (state) =>{
            state.status = "idle"
            
        }).addCase(getEvents.pending, (state) =>{
            state.status = "pendingGetEvents"         
        }).addCase(getEvents.fulfilled, (state, action) =>{
            state.status = "idle";
            const { items, page, perPage, totalPages } = action.payload;
            if(page === 1){
                eventAdapter.setAll(state, items);
            }
            else {
                eventAdapter.addMany(state,items);
            }
            const isLastPage = page >= totalPages || items.length < perPage;
            state.hasMore = !isLastPage;
            state.nextPage = isLastPage ? null : page + 1;
        }).addCase(getEvents.rejected, (state) => {
            state.status = "idle";

        }).addCase(getMyEvents.pending, (state) =>{
            state.status = "pendingGetMyEvents"         
        }).addCase(getMyEvents.fulfilled, (state, action) =>{
            state.status = "idle"       
            const { items, page, perPage, totalPages } = action.payload;
            if(page === 1){
                eventAdapter.setAll(state, items);
            }
            else {
                eventAdapter.addMany(state, items);
            }
            const isLastPage = page >= totalPages || items.length < perPage;
            state.hasMore = !isLastPage;
            state.nextPage = isLastPage ? null : page + 1;  
        }).addCase(getMyEvents.rejected, (state) =>{
            state.status = "idle"         
        })

    )

    
})

export const { clearEvents } = eventSlice.actions;

export const { selectAll: selectAllEvents } =
  eventAdapter.getSelectors((state: RootState) => state.eventRequests);