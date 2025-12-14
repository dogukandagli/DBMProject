export interface EventCreateRequest 
{
  title: string;
  description?: string;
  eventStartDate: string; 
  eventEndDate?: string;
  coverPhoto?: File; 
  latitude: number;
  longitude: number;
  capacity?: number; 
  price?: number;    
}