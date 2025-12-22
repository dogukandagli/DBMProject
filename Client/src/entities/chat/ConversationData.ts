export interface ConversationData {
  id: string;
  title: string;
  subtitle: string | null;
  avatarUrl: string | null;
  conversationType: string;
  loanContextDto: LoanContextDto;
}

export interface LoanContextDto {
  loanTransactionId: string;
  transactionStatus: string;
  loanPeriodStart: string; // ISO 8601 date string
  loanPeriodEnd: string; // ISO 8601 date string
  borrowerId: string;
  lenderId: string;
  actorRole: ActorRole;
  qrMode: QrMode;
  requiredAction: RequiredAction;
}

export type ActorRole = "Viewer" | "Borrower" | "Lender";

export const QrMode = {
  None: "None",
  Generate: "Generate",
  Scan: "Scan",
} as const;

export type QrMode = (typeof QrMode)[keyof typeof QrMode];

export const RequiredAction = {
  None: "None",
  LenderGeneratePickupQr: "LenderGeneratePickupQr",
  BorrowerScanPickUpQr: "BorrowerScanPickUpQr",
  BorrowerGenerateReturnQr: "BorrowerGenerateReturnQr",
  LenderScanReturnQr: "LenderScanReturnQr",
} as const;

export type RequiredAction =
  (typeof RequiredAction)[keyof typeof RequiredAction];
