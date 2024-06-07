export interface Success<T> {
  success: true;
  data: T;
}

export interface Failure {
  success: false;
  message?: string;
}

export type Result<T = null> = Success<T> | Failure;
