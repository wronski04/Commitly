import { AxiosError } from "axios";

interface ApiErrorBody {
  detail?: string | { msg: string }[];
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const detail = (error.response?.data as ApiErrorBody | undefined)?.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail) && detail.length > 0) {
      return detail[0].msg;
    }
  }
  return fallback;
}
