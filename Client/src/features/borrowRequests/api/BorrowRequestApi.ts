import { queries } from "../../../shared/api/ApiClient";

export const BorrowRequest = {
  createBorrowRequest: (formData: any) =>
    queries.post("borrowRequests", formData),
  getBorrowRequest: (pageParam: number) =>
    queries.get(`borrowRequests/${pageParam}/6`),
  getMyBorrowRequest: (pageParam: number) =>
    queries.get(`borrowRequests/me/${pageParam}/6`),
  createOffer: (fomdata: any) =>
    queries.post("borrowRequests/createOffer", fomdata),
  getBorrowRequestDetail: (data: number) =>
    queries.get(`borrowRequests/${data}`),
};
