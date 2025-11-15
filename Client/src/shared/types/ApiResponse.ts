export type ApiResponse<T> = {
  data: T | null;
  errorMessages: string[];
  isSuccessful: boolean;
  statusCode: number;
};
