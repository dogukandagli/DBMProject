import type { TimeSlotDto, UserSummaryDto } from "./BorrowRequestDto";
import type { ConditionType, HandoverMethodType } from "./ConditionEnum";

export interface RequestActionsDto {
  canEdit: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canReopen: boolean;
}

export interface OwnerOfferActionsDto {
  canAccept: boolean;
  canReject: boolean;
}
export interface OfferSideActionsDto {
  canCancel: boolean;
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
  handoverMethod: HandoverMethodType;
  condition: ConditionType;
  lender: UserSummaryDto;
  status: number;
  availableDates: TimeSlotDto;
  actions: OwnerOfferActionsDto | null;
  OfferSideActionsDto: OfferSideActionsDto | null;
  acceptedAt: string | null;
  createdAt: string;
}

export interface BorrowRequestDetailDto {
  id: string;
  neighborhoodId: number;
  status: number;
  borrower: UserSummaryDto;
  itemNeeded: ItemNeededDto;
  neededDates: TimeSlotDto;
  actions: RequestActionsDto;
  createdAt: string;
  offers: OfferDto[];
}
