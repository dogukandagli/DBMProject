export interface User {
  id: string;
  email: string;
  fullName: string;
  photoUrl?: string;
  isLocationVerified: boolean;
  neighborhoodId: number;
  locationText: string;
}
