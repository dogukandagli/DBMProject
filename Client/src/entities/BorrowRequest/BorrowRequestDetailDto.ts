// 1. Ortak Kullanılan Alt Tipler (Reusables)

import type { TimeSlotDto, UserSummaryDto } from "./BorrowRequestDto";
import type {
  ConditionType,
  HandoverMethodType,
  OfferStatusType,
} from "./ConditionEnum";

export interface RequestActionsDto {
  canEdit: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canReopen: boolean;
}

export interface OfferActionsDto {
  canAccept: boolean;
  canReject: boolean;
}

export interface ItemNeededDto {
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
}

export interface OfferDto {
  id: string;
  itemImageUrls: string[];
  description: string;
  handoverMethod: HandoverMethodType; // Enum olabilir
  condition: ConditionType; // Enum olabilir
  lender: UserSummaryDto;
  status: OfferStatusType; // Enum olabilir
  availableDates: TimeSlotDto;
  actions: OfferActionsDto;
  acceptedAt: string | null; // ISO Date string veya null
}

// 4. Ana Kök Tip (Root Type)

export interface BorrowRequestDetailDto {
  id: string;
  neighborhoodId: number;
  status: number; // Enum olabilir (Örn: Pending, Completed)
  borrower: UserSummaryDto;
  itemNeeded: ItemNeededDto;
  neededDates: TimeSlotDto;
  actions: RequestActionsDto;
  createdAt: string; // ISO Date string
  offers: OfferDto[];
}
