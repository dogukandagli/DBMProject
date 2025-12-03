export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePhotoUrl?: string | null;
  coverPhotoUrl?: string | null;
  isLocationVerified: boolean;
  neighborhoodId: number;
  locationText: string;
  city: string;
  district: string;
  neighborhood: string;
  biography?: string | null;
}
