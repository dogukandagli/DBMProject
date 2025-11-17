import { queries } from "../../../shared/api/ApiClient";

const Location = {
  findByGps: (formData: any) => queries.post("location/find-by-gps", formData),
};

export default Location;
