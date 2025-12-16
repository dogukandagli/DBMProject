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
  getBorrowRequestDetail: (data: string) =>
    queries.get(`borrowRequests/${data}`),
  acceptOffer: (formData: any) =>
    queries.post("borrowRequests/acceptOffer", formData),
  rejectOffer: (formData: any) =>
    queries.post("borrowRequests/rejectOffer", formData),
  cancelBorrowRequest: (formData: any) =>
    queries.post("borrowRequests/cancelBorrowRequest", formData),
  deleteBorrowRequest: (formdata: string) =>
    queries.delete(`borrowRequests/${formdata}`),
  getmyOfferByBorrowRequest: (borrowRequestId: string) =>
    queries.get(`borrowRequests/${borrowRequestId}/offers/me`),
};
