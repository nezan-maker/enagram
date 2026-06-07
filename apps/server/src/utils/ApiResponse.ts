interface ApiResponsePayload<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const ApiResponse = <T>(statusCode: number, message: string, data: T): ApiResponsePayload<T> => ({
  success: true,
  statusCode,
  message,
  data,
});
