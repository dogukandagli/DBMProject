// types.ts

export interface UserSummaryDto {
  id: string;
  fullName: string;
  profileImageUrl?: string;
}

export interface ItemSpecificationDto {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface TimeSlotDto {
  startDate: string;
  endDate: string;
}

export interface OfferSummaryDto {
  id: string;
  description: string;
  condition: string; // Enum string
  handoverMethod: string; // Enum string
  offerStatus: string; // Enum string
  availableDateDto?: TimeSlotDto;
}

export interface BorrowRequestActionsDto {
  canEdit: boolean;
  canCancel: boolean;
  canMakeOffer: boolean;
  canViewOffers: boolean;
  hasOffered: boolean;
  canAcceptOffer: boolean;
  canWithdrawOffer: boolean;
  canEditOffer: boolean;
}

export interface BorrowRequestDto {
  id: string;
  borrower: UserSummaryDto;
  itemNeeded: ItemSpecificationDto;
  neededDates: TimeSlotDto;
  borrowRequestStatus: string; // Enum
  createdAt: string;
  offerCount: number;
  offerSummaryDto?: OfferSummaryDto;
  borrowRequestActionsDto: BorrowRequestActionsDto;
}
