export interface Response<T> {
  isSuccess?: boolean;
  message?: string;
  data?: T
}