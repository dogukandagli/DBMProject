import { queries } from "../../../shared/api/ApiClient";

const Neighborhood = {
  getNeighborhoods: (url: string) => queries.get(`odata/neighborhoods${url}`),
};

export default Neighborhood;
