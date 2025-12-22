import { queries } from "../../../shared/api/ApiClient";

export const ConvertsationApi = {
  getConversations: (page: number) => queries.get(`conversation/${page}/10`),
};
