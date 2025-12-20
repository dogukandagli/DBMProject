export interface EventCreateDto
{
  EventId: string;
  Title: string;
  CoverPhotoUrl?: string;
  Description?: string;
  EventStartDate: string; 
  EventEndDate?: string;
  CreatedAt: string;
  FormattedAddress: string;
  Capacity?: number; 
  Price?: number;
  CurrentCount: number; 
  UserDto: UserDto;
  EventActionsDto: EventActionsDto;
  EventOwnerActionsDto: EventOwnerActionsDto;
}

export interface UserDto
{
  UserId: string;
  FullName: string;
  ProfilePhotoUrl?: string;
  IsOwner: boolean;
}

export interface EventActionsDto
{
  CanJoin: boolean;
  CanLeave: boolean;
}

export interface EventOwnerActionsDto
{
  CanDelete: boolean;
  CanCancel: boolean;
  CanEdit: boolean;
}
