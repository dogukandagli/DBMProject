import { queries } from "../../../shared/api/ApiClient";

export const LoanTransaction = {
  generateHandoverQr: (data: any) =>
    queries.post("loanTransaction/generate-handover-qr", data),
  scanHandoverQr: (data: any) =>
    queries.post("loanTransaction/scan-handover-qr", data),
  generateReturnQr: (data: any) =>
    queries.post("loanTransaction/generate-return-qr", data),
  scanReturnQr: (data: any) =>
    queries.post("loanTransaction/scan-return-qr", data),
};
