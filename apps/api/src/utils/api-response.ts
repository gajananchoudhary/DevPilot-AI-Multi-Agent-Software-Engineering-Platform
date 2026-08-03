import type { ApiErrorDetail, ApiResponse } from "@forgeai/types";
import type { Response } from "express";

export function sendSuccess<TData>(
  res: Response,
  statusCode: number,
  message: string,
  data: TData,
  meta: Record<string, unknown> = {}
) {
  const body: ApiResponse<TData> = {
    data,
    errors: null,
    message,
    meta,
    success: true
  };

  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors: ApiErrorDetail[],
  meta: Record<string, unknown> = {}
) {
  const body: ApiResponse = {
    data: null,
    errors,
    message,
    meta,
    success: false
  };

  return res.status(statusCode).json(body);
}
