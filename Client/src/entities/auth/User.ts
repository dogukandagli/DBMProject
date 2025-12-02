export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePhotoUrl?: string;
  coverPhotoUrl?: string;
  isLocationVerified: boolean;
  neighborhoodId: number;
  locationText: string;
  city: string;
  district: string;
  neighborhood: string;
  biography: string;
}
