import { queries } from "../../../shared/api/ApiClient";

export const BorrowRequest = {
  createBorrowRequest: (formData: any) =>
    queries.post("borrowRequests", formData),
  getBorrowRequest: (pageParam: number) =>
    queries.get(`borrowRequests/${pageParam}/6`),
};
