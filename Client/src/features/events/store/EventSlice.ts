import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Event } from "../api/EventApi";

interface EventState 
{
  status: string;
}

const initialState: EventState = 
{
  status: "idle",
};

export const createEvent = createAsyncThunk<void, FormData>(
    "event/createEvent",
    async(formData) => {
        const response = await Event.createEvent(formData)
        return response.data
    }
)

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers:{},
    extraReducers: (builder) => (
        builder.addCase(createEvent.pending,(state) => {
            state.status = "pendingCreateEvent"
        }).addCase(createEvent.fulfilled,(state) => {
            state.status = "idle"
        }).addCase(createEvent.rejected,(state) => {
            state.status = "idle"
        })
    )

    
})