import { queries } from "../../../shared/api/ApiClient";

export const BorrowRequest = {
  createBorrowRequest: (formData: any) =>
    queries.post("borrowRequests", formData),
};
