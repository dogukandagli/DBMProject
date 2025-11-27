import { queries } from "../../../shared/api/ApiClient";

const Location = {
  findByGps: (formData: any) => queries.post("location/find-by-gps", formData),
  autoComplete: (formData: any) =>
    queries.post("location/autoComplete", formData),
  placeDetails: (formData: any) =>
    queries.post("location/placeDetails", formData),
  reverseGeocode: (formData: any) =>
    queries.post("location/reverseGeocode", formData),
};

export default Location;
