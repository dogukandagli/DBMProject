import type { TimeSlotDto, UserSummaryDto } from "./BorrowRequestDto";

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
  handoverMethod: number;
  condition: number;
  lender: UserSummaryDto;
  status: number;
  availableDates: TimeSlotDto;
  actions: OfferActionsDto;
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
