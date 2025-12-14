import { queries } from "../../../shared/api/ApiClient";

export const Event = {
    createEvent: (formData: any) => queries.post("events", formData)
}