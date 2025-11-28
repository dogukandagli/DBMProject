export interface GeoPoint {
  latDegrees: number;
  lonDegrees: number;
}

export interface PlaceDetails {
  placeId?: string;

  streetAddress: string | null;
  city: string | null;
  district: string | null;
  neighborhood: string | null;
  postalCode: string | null;
  country: string | null;
  geoPoint: GeoPoint | null;
  formattedAddress: string | null;
}
