export interface EventCreateDto
{
  eventId: string;
  title: string;
  coverPhotoUrl?: string;
  description?: string;
  startTime: string; 
  endTime: string;
  createdAt: string;
  formattedAddress: string;
  capacity?: number; 
  price?: number;
  currentCount: number; 
  userDto: UserDto;
  eventActions: eventActions;
  eventOwnerActions: eventOwnerActions;
}

export interface UserDto
{
  userId: string;
  fullName: string;
  profilePhotoUrl?: string;
  isOwner: boolean;
}

export interface eventActions
{
  canJoin: boolean;
  canLeave: boolean;
}

export interface eventOwnerActions
{
  canDelete: boolean;
  canCancel: boolean;
  CanEdit: boolean;
}
