/**
 * Canonical API wire envelope (docs/project/Architecture.md §6.3).
 *
 * No module may introduce a third response shape. Success and failure
 * envelopes are exactly the two shapes below.
 */

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "STALE_VERSION"
  | "UNAVAILABLE"
  | "INTERNAL_ERROR";

/** Field-level validation messages, keyed by wire (camelCase) field name. */
export interface FieldErrorMap {
  [field: string]: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  requestId: string;
}

export interface ApiFailure {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    fields?: FieldErrorMap;
    requestId: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function ok<T>(data: T, requestId: string): ApiSuccess<T> {
  return { success: true, data, requestId };
}

export function fail(
  code: ApiErrorCode,
  message: string,
  requestId: string,
  fields?: FieldErrorMap,
): ApiFailure {
  const error: ApiFailure["error"] = { code, message, requestId };
  if (fields !== undefined) {
    error.fields = fields;
  }
  return { success: false, error };
}

export function isApiFailure<T>(
  response: ApiResponse<T>,
): response is ApiFailure {
  return response.success === false;
}

export function isApiSuccess<T>(
  response: ApiResponse<T>,
): response is ApiSuccess<T> {
  return response.success === true;
}
